import { supabase } from "./client";

export async function getReportTags() {

  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .eq("tipo", "report")
    .eq("is_active", true);

  if (error) {

    console.error(error);

    return [];
  }

  return data;
}

export async function saveReportTags(
  reportId,
  tags
) {

  const payload = tags.map(
    (tagId) => ({
      report_id: reportId,
      tag_id: tagId
    })
  );

  console.log(
    "PAYLOAD:",
    payload
  );

  const { error } = await supabase
    .from("report_tags")
    .insert(payload);

  if (error) {

    console.error(
      "Erro report Tags:",
      error
    );

    return false;
  }

  return true;
}