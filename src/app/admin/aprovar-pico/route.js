import { createClient } from "../../../../../lib/supabase/server";
import { NextResponse } from "next/server";

const ADMIN_EMAILS = ["dvfldev22@gmail.com"]; // ← mesmo email

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const formData = await request.formData();
  const id = formData.get("id");

  await supabase
    .from("spot_requests")
    .update({ approved: true })
    .eq("id", id);

  return NextResponse.redirect(new URL("/admin", request.url));
}