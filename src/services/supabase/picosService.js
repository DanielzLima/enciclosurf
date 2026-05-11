import { supabase } from "./client";

export async function getPicos() {
  const { data, error } = await supabase
    .from("picos")
    .select("*");

  if (error) {
    console.error("Erro ao buscar picos:", error);
    return [];
  }

  return data;
}

// POST
export async function addPico(pico) {
  const { data, error } = await supabase
    .from("picos")
    .insert([pico]);

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}


// auto complete

export async function getPicoBySlug(slug) {
  const { data, error } = await supabase
    .from("picos")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;

  return data;
}