import { supabase } from "./client";

export async function createSpotRequest(data) {

  // BUSCAR REQUESTS
  const { data: existing } = await supabase
    .from("spot_requests")
    .select("*");

  // VERIFICAR DUPLICIDADE
  const duplicated = existing?.find((spot) => {

    const distance =
      getDistanceFromLatLonInKm(
        spot.lat,
        spot.lng,
        data.lat,
        data.lng
      );

    return distance < 0.4;  // --> 400m
  });

  // SE JÁ EXISTE
  if (duplicated) {

    // SOMAR VOTO
    const { error: voteError } = await supabase
      .from("spot_requests")
      .update({
        votes: (duplicated.votes || 1) + 1,
      })
      .eq("id", duplicated.id);

    if (voteError) {
      throw voteError;
    }

    return {
      duplicated: true,
      spot: duplicated,
    };
  }

  // INSERT NOVO
  const { error } = await supabase
    .from("spot_requests")
    .insert({
      nome: data.nome,
      descricao: data.descricao,
      imagem: data.imagem,
      lat: Number(data.lat),
      lng: Number(data.lng),
      votes: 1,
    });

  if (error) {

    console.error(error);

    throw error;
  }

  return {
    duplicated: false,
  };
}

// DISTÂNCIA
function getDistanceFromLatLonInKm(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat = deg2rad(lat2 - lat1);

  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +

    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}