import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // usa sempre o origin da requisição — funciona em qualquer domínio
  const redirectBase = origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // aguarda o trigger criar o profile (pequeno delay)
      await new Promise((r) => setTimeout(r, 500));

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, onboarding_done")
        .eq("id", data.user.id)
        .single();

      if (!profile?.onboarding_done) {
        return NextResponse.redirect(`${redirectBase}/onboarding`);
      }

      if (profile?.username) {
        return NextResponse.redirect(`${redirectBase}/perfil/${profile.username}`);
      }

      return NextResponse.redirect(`${redirectBase}/`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}