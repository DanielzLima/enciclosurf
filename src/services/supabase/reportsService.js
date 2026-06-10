import { createClient } from "@/lib/supabase/client";

// ← SEM instância no topo do arquivo

export async function createReport(spotId, rating, sessionId) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reports")
    .insert({ spot_id: spotId, rating, session_id: sessionId })
    .select()
    .single();

  if (error) {
    if (error.message?.includes("limite_diario") || error.code === "P0001") {
      return {
        success: false,
        message: "Número máximo de reports diários atingido 🤙",
      };
    }
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