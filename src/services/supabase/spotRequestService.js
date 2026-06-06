import { createClient } from "@/lib/supabase/client";

export async function createSpotRequest(data) {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("spot_requests")
    .select("*");

  const duplicated = existing?.find((spot) => {
    const distance = getDistanceFromLatLonInKm(
      spot.lat, spot.lng, data.lat, data.lng
    );
    return distance < 0.4;
  });

  if (duplicated) {
    // incrementa support_count no request existente
    await supabase
      .from("spot_requests")
      .update({ support_count: (duplicated.support_count || 0) + 1 })
      .eq("id", duplicated.id);

    return { duplicated: true, spot: duplicated };
  }

  const { data: inserted, error } = await supabase
    .from("spot_requests")
    .insert({
      nome: data.nome,
      descricao: data.descricao,
      imagem: data.imagem,
      lat: Number(data.lat),
      lng: Number(data.lng),
      votes: 1,
      support_count: 1, // quem cadastrou já apoia
    })
    .select()
    .single();

  if (error) { console.error(error); throw error; }

  return { duplicated: false, spot: inserted };
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function deg2rad(deg) { return deg * (Math.PI / 180); }