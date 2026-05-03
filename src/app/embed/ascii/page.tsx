'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { decodeEmbedConfig, type EmbedConfigV1 } from '@/lib/ascii/embed/config';
import { templates } from '@/lib/ascii/templates';
import { getArtStyle } from '@/lib/ascii/artStyles';
import TemplateOverlay from '@/app/ascii/TemplateOverlay';
import '@/app/ascii/ascii.css';

const AsciiCanvas = dynamic(() => import('@/app/ascii/AsciiCanvas'), { ssr: false });

function readHash(): string {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);
  return params.get('config') ?? '';
}

export default function AsciiEmbedPage() {
  const [config, setConfig] = useState<EmbedConfigV1 | null>(null);
  const [source, setSource] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    const encoded = readHash();
    if (!encoded) {
      setStatus('error');
      return;
    }
    decodeEmbedConfig(encoded)
      .then(async (cfg) => {
        if (cancelled) return;
        if (!cfg) {
          setStatus('error');
          return;
        }
        setConfig(cfg);
        if (cfg.sourceDataUrl) {
          const img = await new Promise<HTMLImageElement | null>((resolve) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = () => resolve(null);
            i.src = cfg.sourceDataUrl!;
          });
          if (cancelled) return;
          if (img) setSource(img);
        }
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const template = useMemo(() => {
    if (!config) return null;
    const base = templates.find((t) => t.id === config.templateId) ?? templates[0];
    return {
      ...base,
      layout: {
        ...base.layout,
        layers: base.layout.layers.map((l) => ({ ...l, editable: false })),
      },
    };
  }, [config]);

  const artStyle = useMemo(() => {
    if (!config?.artStyleId) return null;
    return getArtStyle(config.artStyleId) ?? null;
  }, [config]);

  if (status === 'loading') return null;

  if (status === 'error' || !config || !template) {
    return (
      <div className="ascii-embed-error">
        Embed config inválido o vacío. Genera uno nuevo desde ASCII Studio.
      </div>
    );
  }

  return (
    <div className="ascii-embed-frame" data-ratio={config.ratio}>
      <AsciiCanvas
        source={source}
        template={template}
        artStyle={artStyle}
        adjust={config.adjust}
        fx={config.fx}
        playing
      />
      <div className="ascii-embed-overlay-host">
        <TemplateOverlay
          template={template}
          texts={config.texts}
          onTextChange={() => {}}
        />
      </div>
    </div>
  );
}
