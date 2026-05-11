import { supabase } from "./client";

export async function createReport(
  spotId,
  rating,
  sessionId
) {

  const today = new Date();

  today.setHours(0,0,0,0);

  // verifica reports hoje
  const { data: existing } = await supabase
    .from("reports")
    .select("*")
    .eq("spot_id", spotId)
    .eq("session_id", sessionId)
    .gte("created_at", today.toISOString());

  // limite
  if (existing && existing.length >= 2) {

    return {
      success: false,
      message:
        "Você já enviou 2 reports hoje 🌊"
    };
  }

  // cria report
  const { error } = await supabase
    .from("reports")
    .insert({
      spot_id: spotId,
      rating,
      session_id: sessionId
    });

  if (error) {

    console.error(error);

    return {
      success: false,
      message:
        "Erro ao enviar report."
    };
  }

  return {
    success: true,
    message:
      "Obrigado por colaborar para o crescimento da plataforma 🌊"
  };
}

export async function getReportsBySpot(
  spotId
) {

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("spot_id", spotId)
    .order("created_at", {
      ascending: false
    });

  if (error) {

    console.error(error);

    return [];
  }

  return data;
}

export async function getTodayReports(
  spotId
) {

  const today = new Date();

  today.setHours(0,0,0,0);

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("spot_id", spotId)
    .gte(
      "created_at",
      today.toISOString()
    );

  if (error) {

    console.error(error);

    return [];
  }

  return data;
}

export async function getYesterdayReports(
  spotId
) {

  const today = new Date();

  const yesterday = new Date();

  today.setHours(0,0,0,0);

  yesterday.setDate(
    today.getDate() - 1
  );

  yesterday.setHours(0,0,0,0);

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("spot_id", spotId)
    .gte(
      "created_at",
      yesterday.toISOString()
    )
    .lt(
      "created_at",
      today.toISOString()
    );

  if (error) {

    console.error(error);

    return [];
  }

  return data;
}