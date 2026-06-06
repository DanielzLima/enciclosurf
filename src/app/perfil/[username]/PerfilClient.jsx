"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

const ROLE_LABELS = {
  surfista:     { label: "Surfista",            emoji: "🏄" },
  longboarder:  { label: "Longboarder",         emoji: "🏄" },
  bodyboarder:  { label: "Bodyboarder",         emoji: "🌊" },
  bodysurf:     { label: "Bodysurfer",          emoji: "🤽" },
  sup:          { label: "SUP",                 emoji: "🚣" },
  skimboard:    { label: "Skimboarder",         emoji: "💧" },
  instrutor:    { label: "Instrutor",           emoji: "🎓" },
  juiz:         { label: "Juiz de competição",  emoji: "🏆" },
  salva_vidas:  { label: "Salva-vidas",         emoji: "🛟" },
  treinador:    { label: "Treinador",           emoji: "📋" },
  shaper:       { label: "Shaper",              emoji: "🔧" },
  consertador:  { label: "Consertador",         emoji: "🛠️" },
  loja:         { label: "Loja de surf",        emoji: "🏪" },
  fotografo:    { label: "Fotógrafo",           emoji: "📸" },
  filmmaker:    { label: "Filmmaker",           emoji: "🎥" },
  criador:      { label: "Criador de conteúdo", emoji: "📱" },
  escola:       { label: "Escola de surf",      emoji: "🌊" },
  pousada:      { label: "Pousada",             emoji: "🏠" },
  barraca:      { label: "Barraca de praia",    emoji: "⛱️" },
  comercio:     { label: "Comércio local",      emoji: "🛒" },
  restaurante:  { label: "Restaurante",         emoji: "🍽️" },
  viajante:     { label: "Surf tripper",        emoji: "✈️" },
  colecionador: { label: "Colecionador",        emoji: "🎨" },
  fa:           { label: "Fã do surf",          emoji: "❤️" },
};

const ACTION_LABEL = {
  report:         { label: "Report de condições", emoji: "🌊" },
  new_spot:       { label: "Novo pico sugerido",  emoji: "📍" },
  spot_tag:       { label: "Tag local votada",    emoji: "🏷️" },
  apoio_recebido: { label: "Apoio recebido",      emoji: "❤️" },
};

export default function PerfilClient({ profile, isOwner, currentUserId, jaApoiou }) {
  const [apoiado, setApoiado] = useState(jaApoiou);
  const [apoioCount, setApoioCount] = useState(profile.support_count ?? 0);
  const [loadingApoio, setLoadingApoio] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [showHistorico, setShowHistorico] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  const pri = ROLE_LABELS[profile.primary_role];
  const secs = (profile.secondary_roles ?? []).map((r) => ROLE_LABELS[r]).filter(Boolean);

  async function toggleApoio() {
    if (!currentUserId) { setShowLogin(true); return; }
    if (isOwner) return;
    setLoadingApoio(true);
    const supabase = createClient();
    if (apoiado) {
      await supabase.from("supports").delete()
        .eq("supporter_id", currentUserId)
        .eq("target_type", "profile")
        .eq("target_id", profile.id);
      await supabase.from("profiles")
        .update({ support_count: apoioCount - 1 })
        .eq("id", profile.id);
      setApoiado(false);
      setApoioCount((c) => c - 1);
    } else {
      await supabase.from("supports").insert({
        supporter_id: currentUserId,
        target_type: "profile",
        target_id: profile.id,
      });
      await supabase.from("profiles")
        .update({ support_count: apoioCount + 1 })
        .eq("id", profile.id);
      setApoiado(true);
      setApoioCount((c) => c + 1);
    }
    setLoadingApoio(false);
  }

  async function loadHistorico() {
    setLoadingHistorico(true);
    setShowHistorico(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("points_log")
      .select("action, points, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setHistorico(data || []);
    setLoadingHistorico(false);
  }

  function compartilhar() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${profile.display_name} no Enciclosurf`,
        text: "Apoie meu perfil na Enciclosurf 🤙",
        url,
      }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(url);
    setLinkCopiado(true);
    setTimeout(() => setLinkCopiado(false), 2000);
  }

  return (
    <div className="pf-page">
      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}

      {/* MODAL HISTÓRICO */}
      {showHistorico && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "flex-end",
            justifyContent: "center", zIndex: 9999,
          }}
          onClick={() => setShowHistorico(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px 20px 0 0",
              padding: "24px 20px 40px",
              width: "100%", maxWidth: 560,
              maxHeight: "70vh", overflowY: "auto",
            }}
          >
            <div style={{ width: 36, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 99, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "white" }}>Histórico de pontos</h3>
              <span style={{ fontSize: 13, color: "#38bdf8", fontWeight: 700 }}>
                {profile.contribution_points ?? 0} pts total
              </span>
            </div>

            {loadingHistorico ? (
              <p style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: 20 }}>Carregando...</p>
            ) : historico.length === 0 ? (
              <p style={{ color: "#475569", fontSize: 13, textAlign: "center", padding: 20 }}>
                Nenhum ponto ainda. Faça um report ou vote em tags! 🤙
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {historico.map((item, i) => {
                  const acao = ACTION_LABEL[item.action] || { label: item.action, emoji: "⭐" };
                  const data = new Date(item.created_at).toLocaleString("pt-BR", {
                    day: "2-digit", month: "2-digit",
                    hour: "2-digit", minute: "2-digit",
                    timeZone: "America/Recife",
                  });
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "10px 12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 10,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16 }}>{acao.emoji}</span>
                        <div>
                          <p style={{ fontSize: 12, color: "white", fontWeight: 500 }}>{acao.label}</p>
                          <p style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>{data}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#38bdf8" }}>+{item.points}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pf-card">
        <div className="pf-cover" />
        <div className="pf-body">

          <div className="pf-top-row">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.display_name} className="pf-avatar" />
            ) : (
              <div className="pf-avatar pf-avatar-fallback">
                {profile.display_name?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            {isOwner && <a href="/perfil/editar" className="pf-edit-btn">✏️ Editar perfil</a>}
          </div>

          <h1 className="pf-name">{profile.display_name}</h1>
          <p className="pf-username">
            {profile.username && `@${profile.username}`}
            {profile.city && ` · ${profile.city}${profile.uf ? `, ${profile.uf.toUpperCase()}` : ""}`}
          </p>

          {profile.bio && <p className="pf-bio">{profile.bio}</p>}

          <div className="pf-divider" />

          {/* SELOS */}
          {pri && (
            <div className="pf-selos">
              <p className="pf-sec-label">Características</p>
              <div className="pf-selos-row">
                <span className="pf-selo-pri">{pri.emoji} {pri.label}</span>
                {secs.map((s, i) => (
                  <span key={i} className="pf-selo-sec">{s.emoji} {s.label}</span>
                ))}
              </div>
            </div>
          )}

          {/* PONTOS DE CONTRIBUIÇÃO */}
          <div style={{
            marginTop: 16,
            background: "rgba(14,165,233,0.06)",
            border: "1px solid rgba(14,165,233,0.15)",
            borderRadius: 14,
            padding: "14px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "white" }}>🏄 Pontos de Contribuição</p>
              <span style={{
                fontSize: 10, padding: "2px 8px", borderRadius: 999,
                background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.25)",
                color: "#f59e0b", fontWeight: 600,
              }}>BETA</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: "#38bdf8", lineHeight: 1, letterSpacing: "-1px" }}>
                {profile.contribution_points ?? 0}
                <span style={{ fontSize: 13, fontWeight: 400, color: "#475569", marginLeft: 6 }}>pts</span>
              </p>
              {isOwner && (
                <button onClick={loadHistorico} style={{
                  fontSize: 11, color: "#38bdf8",
                  background: "rgba(14,165,233,0.1)",
                  border: "1px solid rgba(14,165,233,0.2)",
                  borderRadius: 8, padding: "4px 10px", cursor: "pointer",
                }}>
                  Ver histórico
                </button>
              )}
            </div>
            <p style={{ fontSize: 11, color: "#475569", marginTop: 6, lineHeight: 1.5 }}>
              Report: +10pts · Tag local: +5pts
            </p>
            <p style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>
              ⚠️ Sistema em fase de testes. Pontos acumulados contarão no programa de recompensas.
            </p>
          </div>

          {/* APOIO */}
          <div className="pf-apoio">
            <div>
              <p className="pf-apoio-count">{apoioCount}</p>
              <p className="pf-apoio-desc">
                {apoioCount === 1 ? "pessoa apoia este perfil" : "pessoas apoiam este perfil"}
              </p>
            </div>
            {!isOwner && (
              <button
                className={`pf-apoio-btn ${apoiado ? "apoiado" : ""}`}
                onClick={toggleApoio}
                disabled={loadingApoio}
              >
                {loadingApoio ? "..." : apoiado ? "❤️ Apoiando" : "🤍 Apoiar"}
              </button>
            )}
          </div>

          {/* REDES SOCIAIS */}
          {(profile.whatsapp || profile.instagram || profile.tiktok || profile.website) && (
            <>
              <div className="pf-divider" />
              <p className="pf-sec-label">Mídias sociais</p>
              <div className="pf-contato">
                {profile.whatsapp && (
                  <a href={`https://wa.me/55${profile.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="pf-contato-item">
                    💬 WhatsApp
                  </a>
                )}
                {profile.instagram && (
                  <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="pf-contato-item">
                    📷 {profile.instagram}
                  </a>
                )}
                {profile.tiktok && (
                  <a href={`https://tiktok.com/@${profile.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="pf-contato-item">
                    🎵 {profile.tiktok}
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="pf-contato-item">
                    🌐 {profile.website}
                  </a>
                )}
              </div>
            </>
          )}

          <div className="pf-divider" />
          <p className="pf-sec-label">Compartilhar perfil</p>
          <div className="pf-share-row">
            <button className="pf-share-btn pf-share-copy" onClick={compartilhar}>
              {linkCopiado ? "✓ Copiado!" : "⬆ Compartilhar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}