import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, primary_role")
        .eq("id", data.user.id)
        .single();

      // sem username = primeiro acesso = onboarding
      if (!profile?.username || !profile?.primary_role) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      // já tem perfil completo = vai direto pro perfil
      return NextResponse.redirect(`${origin}/perfil/${profile.username}`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}