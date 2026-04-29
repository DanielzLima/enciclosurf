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

export async function getPicoById(id) {
  if (!id) return null;

  const { data, error } = await supabase
    .from("picos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}