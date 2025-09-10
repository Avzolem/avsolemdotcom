import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { numbers, message } = await request.json();

    if (!numbers || !message) {
      return NextResponse.json(
        { error: 'Numbers and message are required' },
        { status: 400 }
      );
    }

    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!whatsappToken || !phoneNumberId) {
      return NextResponse.json(
        { error: 'WhatsApp credentials not configured' },
        { status: 500 }
      );
    }

    const results = [];
    const phoneNumbers = numbers.split('\n').filter((num: string) => num.trim());

    for (const number of phoneNumbers) {
      const cleanNumber = number.trim().replace(/\D/g, '');
      
      if (cleanNumber.length < 10) {
        results.push({
          number,
          status: 'error',
          message: 'Invalid phone number format'
        });
        continue;
      }

      try {
        const response = await fetch(
          `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${whatsappToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: cleanNumber,
              text: {
                body: message
              }
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          results.push({
            number: cleanNumber,
            status: 'success',
            message: 'Message sent successfully',
            messageId: data.messages?.[0]?.id
          });
        } else {
          results.push({
            number: cleanNumber,
            status: 'error',
            message: data.error?.message || 'Failed to send message'
          });
        }
      } catch (error) {
        results.push({
          number: cleanNumber,
          status: 'error',
          message: 'Network error'
        });
      }

      // Add delay between messages to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'error').length
      }
    });

  } catch (error) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}