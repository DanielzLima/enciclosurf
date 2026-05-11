import { supabase } from "./client";

export async function uploadSpotImage(file) {

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("spot-images")
    .upload(fileName, file);

  if (error) {

    console.error(error);

    return null;
  }

  const { data } = supabase.storage
    .from("spot-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}