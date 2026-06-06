"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import AuthModal from "./AuthModal";

const SPOT_TAGS = [
  { slug: "acesso-facil",    label: "Acesso fácil",       emoji: "🚗" },
  { slug: "acesso-dificil",  label: "Acesso difícil",     emoji: "⚠️" },
  { slug: "trilha",          label: "Pega trilha",        emoji: "🥾" },
  { slug: "estacionamento",  label: "Tem estacionamento", emoji: "🅿️" },
  { slug: "acesso-barco",    label: "Acesso de barco",    emoji: "⛵" },
  { slug: "onda-facil",      label: "Onda fácil",         emoji: "😊" },
  { slug: "onda-pesada",     label: "Onda pesada",        emoji: "💪" },
  { slug: "onda-rara",       label: "Onda rara",          emoji: "💎" },
  { slug: "tubo",            label: "Dá tubo",            emoji: "🌀" },
  { slug: "onda-longa",      label: "Onda longa",         emoji: "📏" },
  { slug: "fechada",         label: "Fecha muito",        emoji: "🚫" },
  { slug: "fundo-areia",     label: "Fundo areia",        emoji: "🏖️" },
  { slug: "fundo-pedra",     label: "Fundo pedra",        emoji: "🪨" },
  { slug: "fundo-coral",     label: "Fundo coral",        emoji: "🪸" },
  { slug: "fundo-recife",    label: "Recife raso",        emoji: "⚡" },
  { slug: "muita-corrente",  label: "Muita corrente",     emoji: "🌊" },
  { slug: "crowd-pesado",    label: "Crowd pesado",       emoji: "👥" },
  { slug: "crowd-vazio",     label: "Sempre vazio",       emoji: "🏄" },
  { slug: "agua-cristalina", label: "Água cristalina",    emoji: "💎" },
  { slug: "poluicao",        label: "Poluição",           emoji: "⚠️" },
  { slug: "iniciante",       label: "Bom pra iniciante",  emoji: "🟢" },
  { slug: "intermediario",   label: "Intermediário",      emoji: "🟡" },
  { slug: "avancado",        label: "Avançado",           emoji: "🔴" },
  { slug: "locals-only",     label: "Locals only",        emoji: "🤙" },
];

export default function PicoTagsVotar({ picoId, topTags, currentUserId, jaVotou }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [votado, setVotado] = useState(jaVotou);
  const [tagsAtuais, setTagsAtuais] = useState(topTags);
  const [tagError, setTagError] = useState(null);

  function handleAbrirModal() {
    if (!currentUserId) { setShowLogin(true); return; }
    if (votado) return;
    setModalOpen(true);
  }

  function toggleTag(slug) {
    setTagError(null);
    setSelectedTags((prev) => {
      if (prev.includes(slug)) return prev.filter((t) => t !== slug);
      if (prev.length >= 3) {
        setTagError("Máximo 3 características.");
        return prev;
      }
      return [...prev, slug];
    });
  }

  async function handleSalvar() {
    if (selectedTags.length === 0) {
      setTagError("Selecione pelo menos 1 característica.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { data: tagRows } = await supabase
      .from("spot_tags")
      .select("id, slug, label, emoji")
      .in("slug", selectedTags);

    if (tagRows?.length) {
      await supabase
        .from("spot_tag_votes")
        .upsert(
          tagRows.map((tag) => ({
            pico_id: picoId,
            tag_id: tag.id,
            user_id: currentUserId,
          })),
          { onConflict: "pico_id,tag_id,user_id", ignoreDuplicates: true }
        );
        const supabase2 = createClient();
            const { data: { user: u } } = await supabase2.auth.getUser();
            if (u) {
            await supabase2.rpc("add_contribution_points", {
                p_user_id: u.id,
                p_action: "spot_tag",
                p_ref_id: picoId,
            });
            }
    }

    setSaving(false);
    setVotado(true);
    setModalOpen(false);
    setSelectedTags([]);
  }

  return (
    <>
      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}

      {/* SEÇÃO DE TAGS COM VOTOS */}
      <div id="pico-tags-section" style={{ marginTop: 20 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
          flexWrap: "wrap",
          gap: 8,
        }}>
          <p style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}>
            Tags Locais
          </p>

          <button
            onClick={handleAbrirModal}
            disabled={votado}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              border: votado
                ? "1px solid rgba(34,197,94,0.3)"
                : "1px solid rgba(14,165,233,0.3)",
              background: votado
                ? "rgba(34,197,94,0.08)"
                : "rgba(14,165,233,0.08)",
              color: votado ? "#4ade80" : "#38bdf8",
              cursor: votado ? "default" : "pointer",
              transition: "0.2s",
            }}
          >
            {votado ? "✓ Avaliado" : "+ Avaliar este pico"}
          </button>
        </div>

        {/* Tags com contadores */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tagsAtuais.length > 0 ? tagsAtuais.map((tag) => (
            <span
              key={tag.slug}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 500,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8",
              }}
            >
              {tag.emoji} {tag.label}
              <span style={{
                fontSize: 10,
                color: "#475569",
                background: "rgba(255,255,255,0.06)",
                borderRadius: 999,
                padding: "1px 6px",
              }}>
                {tag.votos}
              </span>
            </span>
          )) : (
            <p style={{ fontSize: 12, color: "#475569" }}>
              Seja o primeiro a avaliar este pico! 🤙
            </p>
          )}
        </div>
      </div>

      {/* MODAL DE VOTAÇÃO */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            zIndex: 9999,
            padding: "0 0 0 0",
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 32px",
              width: "100%",
              maxWidth: 560,
              maxHeight: "80vh",
              overflowY: "auto",
              animation: "slideUp 0.3s ease",
            }}
          >
            {/* handle visual */}
            <div style={{
              width: 36, height: 4,
              background: "rgba(255,255,255,0.15)",
              borderRadius: 99,
              margin: "0 auto 20px",
            }} />

            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
              🏄 Como é este pico?
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              Escolha até 3 características que você conhece deste local.
              <span style={{
                marginLeft: 8, fontSize: 11,
                color: selectedTags.length === 3 ? "#f59e0b" : "#475569",
              }}>
                {selectedTags.length}/3
              </span>
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {SPOT_TAGS.map((tag) => {
                const ativo = selectedTags.includes(tag.slug);
                const desabilitado = !ativo && selectedTags.length >= 3;
                return (
                  <button
                    key={tag.slug}
                    onClick={() => toggleTag(tag.slug)}
                    disabled={desabilitado}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: ativo ? 600 : 400,
                      border: ativo
                        ? "1.5px solid #0ea5e9"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: ativo
                        ? "rgba(14,165,233,0.15)"
                        : "rgba(255,255,255,0.04)",
                      color: ativo ? "#38bdf8"
                        : desabilitado ? "#1e293b"
                        : "var(--muted)",
                      cursor: desabilitado ? "not-allowed" : "pointer",
                    }}
                  >
                    {tag.emoji} {tag.label}
                  </button>
                );
              })}
            </div>

            {tagError && (
              <p style={{ fontSize: 12, color: "#f87171", marginBottom: 12 }}>{tagError}</p>
            )}

            <button
              onClick={handleSalvar}
              disabled={saving || selectedTags.length === 0}
              style={{
                width: "100%",
                padding: "13px",
                background: selectedTags.length > 0 ? "#0ea5e9" : "#1e293b",
                color: selectedTags.length > 0 ? "white" : "#475569",
                border: "none",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                cursor: selectedTags.length > 0 ? "pointer" : "not-allowed",
                transition: "0.2s",
              }}
            >
              {saving ? "Salvando..." : "Confirmar avaliação 🤙"}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}