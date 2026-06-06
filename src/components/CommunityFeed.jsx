"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const RATING_LABEL = {
  3: { label: "Clássico", color: "#0ea5e9", emoji: "🌊" },
  2: { label: "Boas",     color: "#eab308", emoji: "🟡" },
  1: { label: "Flat",     color: "#ef4444", emoji: "🔴" },
};

function tempoRelativo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min atrás`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`;
  return `${Math.floor(diff / 86400)}d atrás`;
}

export default function CommunityFeed({ spotId }) {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    if (!spotId) return;

    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select(`
          id, rating, created_at,
          report_tags ( tags ( nome, icone, slug ) )
        `)
        .eq("spot_id", spotId)
        .order("created_at", { ascending: false })
        .limit(6);

      setReports(data || []);
    }

    load();
  }, [spotId]);

  if (!reports.length) return null;

  return (
    <div className="community-wrapper">
      <div className="community-carousel">
        {[...reports, ...reports].map((report, index) => {
          const rating = RATING_LABEL[report.rating] || RATING_LABEL[1];
          const tags = report.report_tags
            ?.map((rt) => rt.tags)
            .filter(Boolean) || [];

          return (
            <div key={index} className="community-card">
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: rating.color,
                }}>
                  {rating.emoji} {rating.label}
                </span>
                <span style={{ fontSize: 11, color: "#475569" }}>
                  {tempoRelativo(report.created_at)}
                </span>
              </div>

              {tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#94a3b8",
                      }}
                    >
                      {tag.icone} {tag.nome}
                    </span>
                  ))}
                </div>
              )}

              {tags.length === 0 && (
                <p style={{ fontSize: 12, color: "#475569" }}>
                  Sem tags neste report
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}