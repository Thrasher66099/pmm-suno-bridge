import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * Reports whether Suno currently demands a captcha for generation.
 *
 * Generation is impossible while `required` is true unless a captcha solver is
 * configured. This probe costs no Suno credits and launches no browser, so it
 * is a cheap way to poll for the requirement clearing before attempting a real
 * (paid) generation.
 */
export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return new NextResponse('Method Not Allowed', {
      headers: { Allow: 'GET', ...corsHeaders },
      status: 405
    });
  }

  try {
    const api = await sunoApi((await cookies()).toString());
    const required = await api.isCaptchaRequired();

    return new NextResponse(
      JSON.stringify({
        captchaRequired: required,
        canGenerate: !required,
        checkedAt: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  } catch (error) {
    console.error('Error checking captcha status:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error. ' + error }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders });
}
