import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, primary_role, onboarding_done")
        .eq("id", data.user.id)
        .single();

      // onboarding só se nunca completou
      if (!profile?.onboarding_done) {
        return NextResponse.redirect(`${siteUrl}/onboarding`);
      }

      // já completou — vai ao perfil
      if (profile?.username) {
        return NextResponse.redirect(`${siteUrl}/perfil/${profile.username}`);
      }

      return NextResponse.redirect(`${siteUrl}/`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}