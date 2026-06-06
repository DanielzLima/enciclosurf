"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

export default function PicoTagsTop({
  picoId, tags, initialCount, currentUserId, jaApoiou
}) {
  const [apoiado, setApoiado] = useState(jaApoiou);
  const [count, setCount] = useState(initialCount ?? 0);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showToast, setShowToast] = useState(false);

  async function handleApoiar() {
    if (!currentUserId) { setShowLogin(true); return; }
    if (apoiado) return; // já apoiou

    setLoading(true);
    const supabase = createClient();

    await supabase.from("pico_supports").insert({
      pico_id: picoId,
      user_id: currentUserId,
    });
    await supabase.from("picos")
      .update({ support_count: count + 1 })
      .eq("id", picoId);

    setApoiado(true);
    setCount((c) => c + 1);
    setLoading(false);

    // mostra toast de indução após apoiar
    setTimeout(() => setShowToast(true), 400);
    setTimeout(() => setShowToast(false), 6000);
  }

  function scrollToTags() {
    setShowToast(false);
    const el = document.getElementById("pico-tags-section");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}

      {/* TOAST DE INDUÇÃO */}
      {showToast && (
        <div
          onClick={scrollToTags}
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #0f172a, #1e293b)",
            border: "1px solid rgba(14,165,233,0.35)",
            borderRadius: 14,
            padding: "14px 20px",
            zIndex: 9999,
            cursor: "pointer",
            maxWidth: 320,
            width: "90%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            animation: "fadeUp 0.3s ease",
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: "white", marginBottom: 4 }}>
            🤙 Obrigado pelo apoio!
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
            Você conhece este pico? Conta 1 característica para a comunidade 👇
          </p>
          <p style={{ fontSize: 11, color: "#0ea5e9", marginTop: 6, fontWeight: 600 }}>
            Toque para avaliar →
          </p>
        </div>
      )}

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        marginTop: 10,
      }}>
        {/* Tags top 4 */}
        {tags.map((tag) => (
          <span
            key={tag.slug}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              background: "rgba(14,165,233,0.08)",
              border: "1px solid rgba(14,165,233,0.18)",
              color: "#94a3b8",
            }}
          >
            {tag.emoji} {tag.label}
          </span>
        ))}

        {/* Botão apoiar — menor, ao lado das tags */}
        <button
          onClick={handleApoiar}
          disabled={loading || apoiado}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            border: apoiado
              ? "1px solid rgba(14,165,233,0.4)"
              : "1px solid rgba(255,255,255,0.12)",
            background: apoiado
              ? "rgba(14,165,233,0.12)"
              : "rgba(255,255,255,0.05)",
            color: apoiado ? "#38bdf8" : "#64748b",
            cursor: apoiado ? "default" : "pointer",
            transition: "0.2s",
            marginLeft: "auto",
          }}
        >
          {loading ? "..." : apoiado ? `❤️ ${count}` : `🤍 ${count} Apoiar`}
        </button>
      </div>
    </>
  );
}