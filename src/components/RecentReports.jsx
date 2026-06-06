"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const RATING_LABEL = {
  3: { label: "Clássico", color: "#0ea5e9", bg: "rgba(14,165,233,0.08)", emoji: "🌊" },
  2: { label: "Boas",     color: "#eab308", bg: "rgba(234,179,8,0.08)",  emoji: "🟡" },
  1: { label: "Flat",     color: "#ef4444", bg: "rgba(239,68,68,0.08)",  emoji: "🔴" },
};

function tempoRelativo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return "hoje";
}

export default function RecentReports({ spotId }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!spotId) return;

    async function load() {
      const supabase = createClient();

      // só reports de hoje
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from("reports")
        .select(`
          id, rating, created_at,
          report_tags ( tags ( nome, icone ) )
        `)
        .eq("spot_id", spotId)
        .gte("created_at", hoje.toISOString())
        .order("created_at", { ascending: false })
        .limit(10); // pega 10 e filtra os mais votados

      if (!data?.length) { setReports([]); return; }

      // agrupa por rating e pega os 3 com mais tags (mais elaborados)
      const ordenados = [...data].sort((a, b) => {
        const tagsA = a.report_tags?.length || 0;
        const tagsB = b.report_tags?.length || 0;
        if (tagsB !== tagsA) return tagsB - tagsA; // mais tags primeiro
        return new Date(b.created_at) - new Date(a.created_at); // mais recente em empate
      }).slice(0, 3);

      setReports(ordenados);
    }

    load();
  }, [spotId]);

 if (!reports.length) return null;

return (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    {reports.map((report) => {
      const r = RATING_LABEL[report.rating] || RATING_LABEL[1];
      const tags = report.report_tags
        ?.map((rt) => rt.tags)
        .filter(Boolean) || [];

      return (
        <div
          key={report.id}
          style={{
            background: r.bg,
            border: `1px solid ${r.color}33`,
            borderRadius: 10,
            padding: "8px 10px",
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: tags.length ? 5 : 0,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: r.color }}>
              {r.emoji} {r.label}
            </span>
            <span style={{ fontSize: 10, color: "#475569" }}>
              {tempoRelativo(report.created_at)}
            </span>
          </div>

          {tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {tags.map((tag, i) => (
                <span key={i} style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#94a3b8",
                }}>
                  {tag.icone} {tag.nome}
                </span>
              ))}
            </div>
          )}
        </div>
      );
    })}
  </div>
);
}