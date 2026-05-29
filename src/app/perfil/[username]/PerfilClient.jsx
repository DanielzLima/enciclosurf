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

export default function PerfilClient({ profile, isOwner, currentUserId, jaApoiou }) {
  const [apoiado, setApoiado] = useState(jaApoiou);
  const [apoioCount, setApoioCount] = useState(profile.support_count ?? 0);
  const [loadingApoio, setLoadingApoio] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [linkCopiado, setLinkCopiado] = useState(false);

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
            {isOwner && (
              <a href="/perfil/editar" className="pf-edit-btn">✏️ Editar perfil</a>
            )}
          </div>

          <h1 className="pf-name">{profile.display_name}</h1>
          <p className="pf-username">
            {profile.username && `@${profile.username}`}
            {profile.city && ` · ${profile.city}${profile.uf ? `, ${profile.uf.toUpperCase()}` : ""}`}
          </p>

          {profile.bio && <p className="pf-bio">{profile.bio}</p>}

          <div className="pf-divider" />

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

          {(profile.whatsapp || profile.instagram || profile.tiktok || profile.website) && (
            <>
              <div className="pf-divider" />
              <p className="pf-sec-label">Midias sociais</p>
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