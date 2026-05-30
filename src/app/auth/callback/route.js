import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // usa a variável de ambiente se disponível, senão usa o origin da request
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, primary_role")
        .eq("id", data.user.id)
        .single();

      if (!profile?.username || !profile?.primary_role) {
        return NextResponse.redirect(`${siteUrl}/onboarding`);
      }

      return NextResponse.redirect(`${siteUrl}/perfil/${profile.username}`);
    }
  }

  return NextResponse.redirect(`${siteUrl}/?error=auth`);
}