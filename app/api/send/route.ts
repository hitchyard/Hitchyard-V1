import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { zip_code } = await request.json();
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
    }

    const emailData = {
      from: 'Hitchyard Advisor <onboarding@resend.dev>',
      to: 'advisor@hitchyard.com',
      subject: `New Performance Audit Request - ${zip_code}`,
      html: `<p>You have a new performance audit request for zip code: <b>${zip_code}</b>.</p>`
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
