import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PerfilClient from "./PerfilClient";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("display_name, bio, avatar_url, city, uf")
    .eq("username", username)
    .single();

  if (!data) return { title: "Perfil não encontrado" };

  const titulo = `${data.display_name} (@${username}) — Enciclosurf`;
  const descricao = data.bio || `Apoie o perfil de ${data.display_name} na Enciclosurf`;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      images: data.avatar_url ? [{ url: data.avatar_url, width: 400, height: 400 }] : [],
      url: `https://enciclosurf.com.br/perfil/${username}`,
    },
    twitter: {
      card: "summary",
      title: titulo,
      description: descricao,
      images: data.avatar_url ? [data.avatar_url] : [],
    },
  };
}

export default async function PerfilPage({ params }) {
  const { username } = await params; 

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*, user_achievements(*)")
    .eq("username", username)
    .single();

  if (error || !profile) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  let jaApoiou = false;
  if (user) {
    const { data: support } = await supabase
      .from("supports")
      .select("id")
      .eq("supporter_id", user.id)
      .eq("target_type", "profile")
      .eq("target_id", profile.id)
      .single();
    jaApoiou = !!support;
  }

  const isOwner = user?.id === profile.id;

  return (
    <PerfilClient
      profile={profile}
      isOwner={isOwner}
      currentUserId={user?.id ?? null}
      jaApoiou={jaApoiou}
    />
  );
}