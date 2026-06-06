import { createClient } from "@/lib/supabase/client";

// ← SEM instância no topo do arquivo

export async function createReport(spotId, rating, sessionId) {
  const supabase = createClient();

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // verifica usuário logado primeiro
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // LOGADO: limite de 2 reports por dia por pico por usuário
    const { count } = await supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("spot_id", spotId)
      .eq("session_id", sessionId) // session vinculada ao user
      .gte("created_at", hoje.toISOString());

    // usa points_log como fonte da verdade para usuários logados
    const { count: countLog } = await supabase
      .from("points_log")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("action", "report")
      .eq("ref_id", spotId)
      .gte("created_at", hoje.toISOString());

    if ((countLog ?? 0) >= 2) {
      return {
        success: false,
        message: "Você já fez 2 reports hoje neste pico 🤙 Volte amanhã!",
      };
    }
  } else {
    // NÃO LOGADO: limite por session_id
    const { count } = await supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("spot_id", spotId)
      .eq("session_id", sessionId)
      .gte("created_at", hoje.toISOString());

    if ((count ?? 0) >= 2) {
      return {
        success: false,
        message: "Limite de reports atingido para hoje 🤙",
      };
    }
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({ spot_id: spotId, rating, session_id: sessionId })
    .select()
    .single();

  if (error) {
    console.error(error);
    return { success: false, message: "Erro ao enviar report." };
  }

  return { success: true, report: data, message: "Obrigado por colaborar 🌊" };
}

export async function getReportsBySpot(spotId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("spot_id", spotId)
    .order("created_at", { ascending: false });

  if (error) { console.error(error); return []; }
  return data;
}

export async function getTodayReports(spotId) {
  const supabase = createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("spot_id", spotId)
    .gte("created_at", today.toISOString());

  if (error) { console.error(error); return []; }
  return data;
}

export async function getYesterdayReports(spotId) {
  const supabase = createClient();
  const today = new Date();
  const yesterday = new Date();
  today.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("spot_id", spotId)
    .gte("created_at", yesterday.toISOString())
    .lt("created_at", today.toISOString());

  if (error) { console.error(error); return []; }
  return data;
}

export async function getRecentReportsWithTags(spotId, limit = 3) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reports")
    .select(`
      id,
      rating,
      created_at,
      report_tags (
        tags (
          nome,
          icone,
          slug
        )
      )
    `)
    .eq("spot_id", spotId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) { console.error(error); return []; }
  return data || [];
}