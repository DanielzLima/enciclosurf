import { createClient } from "@/lib/supabase/client";

export async function getProfile(userId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*, user_achievements(*)")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId, updates) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setRoles(userId, primaryRole, secondaryRoles = []) {
  if (secondaryRoles.length > 2) throw new Error("Máximo 2 papéis secundários");
  return updateProfile(userId, {
    primary_role: primaryRole,
    secondary_roles: secondaryRoles,
  });
}

export async function supportTarget(supporterId, targetType, targetId, picoId = null) {
  const supabase = createClient();
  const { error } = await supabase.from("supports").insert({
    supporter_id: supporterId,
    target_type: targetType, // 'profile' ou 'report'
    target_id: targetId,
    pico_id: picoId,
  });
  if (error) throw error;

  // Incrementa support_count no alvo (se for perfil)
  if (targetType === "profile") {
    await supabase.rpc("add_contribution_points", {
      p_user_id: targetId,
      p_action: "support_received",
    });
    await supabase
      .from("profiles")
      .update({ support_count: supabase.rpc("support_count + 1") })
      .eq("id", targetId);
  }
}