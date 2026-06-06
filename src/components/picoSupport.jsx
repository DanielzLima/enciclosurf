"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function PicoSupport({ picoId, initialCount, currentUserId, jaApoiou }) {
  const [apoiado, setApoiado] = useState(jaApoiou);
  const [count, setCount] = useState(initialCount ?? 0);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  async function toggleApoio() {
    if (!currentUserId) { setShowLogin(true); return; }

    setLoading(true);
    const supabase = createClient();

    if (apoiado) {
      await supabase.from("pico_supports").delete()
        .eq("pico_id", picoId)
        .eq("user_id", currentUserId);
      await supabase.from("picos")
        .update({ support_count: count - 1 })
        .eq("id", picoId);
      setApoiado(false);
      setCount((c) => c - 1);
    } else {
      await supabase.from("pico_supports").insert({
        pico_id: picoId,
        user_id: currentUserId,
      });
      await supabase.from("picos")
        .update({ support_count: count + 1 })
        .eq("id", picoId);
      setApoiado(true);
      setCount((c) => c + 1);
    }
    setLoading(false);
  }

  return (
    <>
      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "12px 16px",
        marginTop: 16,
      }}>
        <div>
          <p style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1 }}>
            {count}
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            {count === 1 ? "pessoa apoia este pico" : "pessoas apoiam este pico"}
          </p>
        </div>
        <button
          onClick={toggleApoio}
          disabled={loading}
          style={{
            marginLeft: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 18px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 600,
            border: apoiado ? "1.5px solid var(--primary)" : "1px solid rgba(255,255,255,0.15)",
            background: apoiado ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.05)",
            color: apoiado ? "var(--primary)" : "var(--muted)",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "0.2s",
          }}
        >
          {loading ? "..." : apoiado ? "❤️ Apoiando" : "🤍 Apoiar"}
        </button>
      </div>
    </>
  );
}