import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import {
  countAskRequestsToday,
  recordAskRequest,
} from '@/lib/mongodb/models/AskRateLimit';
import { buildAskContext, ASK_SYSTEM_PROMPT_BASE } from '@/lib/ai/buildContext';

const DAILY_LIMIT = 5;
const MAX_MESSAGE_CHARS = 1000;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Cache the context string so we don't re-read MDX files on every request.
let cachedContext: string | null = null;
function getContext(): string {
  if (!cachedContext) cachedContext = buildAskContext();
  return cachedContext;
}

function getClientIp(request: NextRequest): string {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function sseEvent(data: unknown): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'AI chat not configured' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { message, history } = (body ?? {}) as {
    message?: unknown;
    history?: unknown;
  };

  if (typeof message !== 'string' || !message.trim()) {
    return new Response(
      JSON.stringify({ error: 'Message required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return new Response(
      JSON.stringify({ error: 'Message too long' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const sanitizedHistory: ChatMessage[] = Array.isArray(history)
    ? (history as unknown[])
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            typeof m === 'object' &&
            ((m as ChatMessage).role === 'user' ||
              (m as ChatMessage).role === 'assistant') &&
            typeof (m as ChatMessage).content === 'string'
        )
        .slice(-10) // keep last 10 turns max
    : [];

  const ip = getClientIp(request);
  const count = await countAskRequestsToday(ip);
  if (count >= DAILY_LIMIT) {
    return new Response(
      JSON.stringify({
        error: 'rate_limited',
        detail: `Daily limit reached (${DAILY_LIMIT} messages per day). Try again tomorrow.`,
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const client = new Anthropic();
  const systemPrompt = `${ASK_SYSTEM_PROMPT_BASE}\n\n---\n\n${getContext()}`;

  const conversation = [
    ...sanitizedHistory,
    { role: 'user' as const, content: message.trim() },
  ];

  await recordAskRequest(ip);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let closed = false;
      const safeClose = () => {
        if (!closed) {
          closed = true;
          controller.close();
        }
      };
      const send = (payload: unknown) => {
        if (!closed) controller.enqueue(encoder.encode(sseEvent(payload)));
      };

      try {
        const response = await client.messages.stream({
          model: 'claude-haiku-4-5',
          max_tokens: 1024,
          system: systemPrompt,
          messages: conversation,
        });

        for await (const event of response) {
          if (closed) break;
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            send({ text: event.delta.text });
          }
        }

        const remaining = Math.max(0, DAILY_LIMIT - count - 1);
        send({ done: true, remaining });
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown error';
        send({ error: msg });
      } finally {
        safeClose();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
