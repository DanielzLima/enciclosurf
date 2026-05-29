import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditarPerfilClient from "./EditarPerfilClient";

export default async function EditarPerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // não logado → vai pra home
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/");

  return <EditarPerfilClient profile={profile} />;
}