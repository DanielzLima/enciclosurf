
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "./onboarding.css";

const ROLES = [
  { id: "surfista",     label: "Surfista",            emoji: "🏄", cat: "Praticantes" },
  { id: "longboarder",  label: "Longboarder",         emoji: "🏄", cat: "Praticantes" },
  { id: "bodyboarder",  label: "Bodyboarder",         emoji: "🌊", cat: "Praticantes" },
  { id: "bodysurf",     label: "Bodysurfer",          emoji: "🤽", cat: "Praticantes" },
  { id: "sup",          label: "SUP",                 emoji: "🚣", cat: "Praticantes" },
  { id: "skimboard",    label: "Skimboarder",         emoji: "💧", cat: "Praticantes" },
  { id: "instrutor",    label: "Instrutor",           emoji: "🎓", cat: "Profissionais" },
  { id: "juiz",         label: "Juiz de competição",  emoji: "🏆", cat: "Profissionais" },
  { id: "salva_vidas",  label: "Salva-vidas",         emoji: "🛟", cat: "Profissionais" },
  { id: "treinador",    label: "Treinador",           emoji: "📋", cat: "Profissionais" },
  { id: "shaper",       label: "Shaper",              emoji: "🔧", cat: "Indústria" },
  { id: "consertador",  label: "Consertador",         emoji: "🛠️", cat: "Indústria" },
  { id: "loja",         label: "Loja de surf",        emoji: "🏪", cat: "Indústria" },
  { id: "fotografo",    label: "Fotógrafo",           emoji: "📸", cat: "Conteúdo" },
  { id: "filmmaker",    label: "Filmmaker",           emoji: "🎥", cat: "Conteúdo" },
  { id: "criador",      label: "Criador de conteúdo", emoji: "📱", cat: "Conteúdo" },
  { id: "escola",       label: "Escola de surf",      emoji: "🌊", cat: "Negócios" },
  { id: "pousada",      label: "Pousada",             emoji: "🏠", cat: "Negócios" },
  { id: "barraca",      label: "Barraca de praia",    emoji: "⛱️", cat: "Negócios" },
  { id: "comercio",     label: "Comércio local",      emoji: "🛒", cat: "Negócios" },
  { id: "restaurante",  label: "Restaurante",         emoji: "🍽️", cat: "Negócios" },
  { id: "viajante",     label: "Surf tripper",        emoji: "✈️", cat: "Lifestyle" },
  { id: "colecionador", label: "Colecionador",        emoji: "🎨", cat: "Lifestyle" },
  { id: "fa",           label: "Fã do surf",          emoji: "❤️", cat: "Lifestyle" },
];

const CATS = [...new Set(ROLES.map((r) => r.cat))];

// 3 etapas: "primary" | "secondary" | "done"
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState("primary");
  const [primaryRole, setPrimaryRole] = useState(null);
  const [secondaryRoles, setSecondaryRoles] = useState([]);
  const [saving, setSaving] = useState(false);

  function selectPrimary(role) {
    setPrimaryRole(role);
    // pequeno delay para o usuário ver o highlight antes de avançar
    setTimeout(() => setStep("secondary"), 350);
  }

  function toggleSecondary(roleId) {
    setSecondaryRoles((prev) => {
      if (prev.includes(roleId)) return prev.filter((r) => r !== roleId);
      if (prev.length >= 2) return prev;
      return [...prev, roleId];
    });
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    router.push(`/perfil/${username}`);
     if (!primaryRole) {
            setError("Escolha pelo menos um papel principal.");
            return;
        }

        // ← adiciona essa validação
        if (!username || username.length < 3 || usernameError) {
            setError("Escolha um nome de usuário válido.");
            return;
        }

        setSaving(true);

    await supabase
      .from("profiles")
      .update({
        primary_role: primaryRole.id,
        secondary_roles: secondaryRoles,
      })
      .eq("id", user.id);

    setStep("done");
    setSaving(false);

    // redireciona para home após 2s mostrando a tela de boas-vindas
    setTimeout(() => router.push("/"), 2000);
  }

  const secRoles = ROLES.filter((r) => secondaryRoles.includes(r.id));
  const left = 2 - secondaryRoles.length;

  return (
    <div className="ob-container">
      {/* Barra de progresso */}
      <div className="ob-progress">
        <div className={`ob-dot ${step === "primary" ? "active" : "done"}`} />
        <div className={`ob-dot ${step === "secondary" ? "active" : step === "done" ? "done" : ""}`} />
        <div className={`ob-dot ${step === "done" ? "active" : ""}`} />
      </div>

      {/* ── ETAPA 1: papel principal ── */}
      {step === "primary" && (
        <div className="ob-step ob-enter">
          <img src="/Enciclosurf-logo.jpg" alt="Enciclosurf" className="ob-logo" />
          <h1>Quem é você no lineup?</h1>
          <p className="ob-sub">Escolha sua principal característica na cultura do surf.</p>

          {CATS.map((cat) => (
            <div key={cat} className="ob-cat">
              <span className="ob-cat-label">{cat}</span>
              <div className="ob-tags">
                {ROLES.filter((r) => r.cat === cat).map((role) => (
                  <button
                    key={role.id}
                    className="ob-tag"
                    onClick={() => selectPrimary(role)}
                  >
                    {role.emoji} {role.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ETAPA 2: características extras ── */}
      {step === "secondary" && (
        <div className="ob-step ob-enter">
          {/* badge do papel principal escolhido */}
          <div className="ob-badge-pri">
            {primaryRole.emoji} {primaryRole.label}
          </div>

          <h1>Adicione até 2 sub-catégorias</h1>
          <p className="ob-sub">
            Escolha até <strong>2 características</strong> que também combinam com você.{" "}
            <span className="ob-counter">
              {secondaryRoles.length === 0
                ? "(opcional)"
                : secondaryRoles.length === 2
                ? "Máximo atingido"
                : `${left} restante`}
            </span>
          </p>

          {CATS.map((cat) => {
            const available = ROLES.filter(
              (r) => r.cat === cat && r.id !== primaryRole.id
            );
            if (!available.length) return null;
            return (
              <div key={cat} className="ob-cat">
                <span className="ob-cat-label">{cat}</span>
                <div className="ob-tags">
                  {available.map((role) => (
                    <button
                      key={role.id}
                      className={`ob-tag ${secondaryRoles.includes(role.id) ? "ob-tag-sec" : ""} ${secondaryRoles.length >= 2 && !secondaryRoles.includes(role.id) ? "ob-tag-disabled" : ""}`}
                      onClick={() => toggleSecondary(role.id)}
                    >
                      {role.emoji} {role.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          <button
            className="ob-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Entrar na plataforma →"}
          </button>
          <button className="ob-skip" onClick={handleSave}>
            Pular por agora
          </button>
        </div>
      )}

      {/* ── ETAPA 3: boas-vindas ── */}
      {step === "done" && (
        <div className="ob-step ob-enter ob-finish">
          <div className="ob-finish-icon">🤙</div>
          <h2>Tudo certo! Bem-vindo ao Enciclosurf</h2>
          <p>
            {secRoles.length
              ? `Você é ${primaryRole.label} com pitadas de ${secRoles.map((r) => r.label).join(" e ")}.`
              : `Você entrou como ${primaryRole.label}. Pode ajustar seu perfil quando quiser.`}
          </p>
          <div className="ob-finish-tags">
            <span className="ob-badge-pri">{primaryRole.emoji} {primaryRole.label}</span>
            {secRoles.map((r) => (
              <span key={r.id} className="ob-badge-sec">{r.emoji} {r.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}