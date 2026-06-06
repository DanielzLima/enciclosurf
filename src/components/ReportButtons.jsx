"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createReport } from "../services/supabase/reportsService";
import { getSessionId } from "../utils/session";
import ReportTagsModal from "./ReportTagsModal";
import { saveReportTags } from "../services/supabase/tagsService";

export default function ReportButtons({ spotId }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openTagsModal, setOpenTagsModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  function handleVote(type) {
    let rating = 1;
    if (type === "good") rating = 2;
    if (type === "classic") rating = 3;
    setSelectedRating(rating);
    setOpenTagsModal(true);
  }

  async function handleSaveTags(selectedTags) {
    try {
      setLoading(true);
      const sessionId = getSessionId();

      const response = await createReport(spotId, selectedRating, sessionId);

      if (!response.success) {
        setMessage(response.message);
        return;
      }

      await saveReportTags(response.report.id, selectedTags);

      // PONTOS — máximo 2 reports por dia por usuário por pico
      const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: resultado } = await supabase.rpc("add_contribution_points", {
            p_user_id: user.id,
            p_action: "report",
            p_ref_id: spotId,
          });
        // conta quantos reports o usuário já fez hoje neste pico
        const { count } = await supabase
          .from("points_log")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("action", "report")
          .eq("ref_id", spotId) // ref_id guarda o spotId para reports
          .gte("created_at", hoje.toISOString());

        // só pontua se fez menos de 2 hoje
        if ((count ?? 0) < 2) {
          await supabase.rpc("add_contribution_points", {
            p_user_id: user.id,
            p_action: "report",
            p_ref_id: spotId, // guarda spotId para poder contar por pico
          });
        }
      }

      setMessage("Report enviado com sucesso 🌊");
      setOpenTagsModal(false);
      setSelectedRating(null);

    } catch (err) {
      console.log(err);
      setMessage("Erro ao enviar report.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 4000);
    }
  }

  return (
    <div className="report-wrapper">
      <div className="report-buttons">
        <button
          className="report-btn classic"
          onClick={() => handleVote("classic")}
          disabled={loading}
        >
          🌊 Clássico
        </button>
        <button
          className="report-btn good"
          onClick={() => handleVote("good")}
          disabled={loading}
        >
          🟡 Boas
        </button>
        <button
          className="report-btn flat"
          onClick={() => handleVote("flat")}
          disabled={loading}
        >
          🔴 Flat
        </button>
      </div>

      {message && (
        <div className="report-message">{message}</div>
      )}

      <ReportTagsModal
        open={openTagsModal}
        onClose={() => setOpenTagsModal(false)}
        onSave={handleSaveTags}
      />
    </div>
  );
}