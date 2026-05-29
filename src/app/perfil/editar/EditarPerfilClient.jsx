"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

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

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

function podeAlterarUsername(username_changed_at) {
  if (!username_changed_at) return true;
  const diff = (new Date() - new Date(username_changed_at)) / (1000 * 60 * 60 * 24);
  return diff >= 30;
}

function diasParaProxTroca(username_changed_at) {
  if (!username_changed_at) return 0;
  const diff = (new Date() - new Date(username_changed_at)) / (1000 * 60 * 60 * 24);
  return Math.ceil(30 - diff);
}

export default function EditarPerfilClient({ profile }) {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [username, setUsername] = useState(profile.username ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [city, setCity] = useState(profile.city ?? "");
  const [uf, setUf] = useState(profile.uf ?? "");
  const [instagram, setInstagram] = useState(profile.instagram ?? "");
  const [tiktok, setTiktok] = useState(profile.tiktok ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? "");
  const [primaryRole, setPrimaryRole] = useState(profile.primary_role ?? null);
  const [secondaryRoles, setSecondaryRoles] = useState(profile.secondary_roles ?? []);
  const [usernameError, setUsernameError] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const podeTrocarUsername = podeAlterarUsername(profile.username_changed_at);
  const diasRestantes = diasParaProxTroca(profile.username_changed_at);
  const usernameAlterado = username !== profile.username;

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError("Imagem muito grande. Máximo 2MB."); return; }
    if (!file.type.startsWith("image/")) { setError("Selecione uma imagem válida."); return; }
    setUploadingAvatar(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${profile.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setError("Erro ao fazer upload. Tente novamente.");
      setUploadingAvatar(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", profile.id);
    setAvatarUrl(publicUrl);
    setUploadingAvatar(false);
  }

  async function checkUsername(value) {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(cleaned);
    if (cleaned === profile.username) { setUsernameError(null); return; }
    if (cleaned.length < 3) { setUsernameError("Mínimo 3 caracteres."); return; }
    setCheckingUsername(true);
    const supabase = createClient();
    const { data } = await supabase.from("profiles").select("id").eq("username", cleaned).single();
    setCheckingUsername(false);
    setUsernameError(data ? "Este nome já está em uso." : null);
  }

  function toggleSecondary(roleId) {
    if (roleId === primaryRole) return;
    setSecondaryRoles((prev) => {
      if (prev.includes(roleId)) return prev.filter((r) => r !== roleId);
      if (prev.length >= 2) { setError("Máximo 2 características secundárias."); return prev; }
      setError(null);
      return [...prev, roleId];
    });
  }

  async function handleSave() {
    if (!displayName.trim()) { setError("Nome não pode ser vazio."); return; }
    if (!primaryRole) { setError("Escolha uma característica principal."); return; }
    if (usernameAlterado && !podeTrocarUsername) { setError(`Você só pode trocar o username em ${diasRestantes} dias.`); return; }
    if (usernameError) { setError("Corrija o username antes de salvar."); return; }
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const updates = {
      display_name: displayName.trim(),
      bio: bio.trim(),
      city: city.trim(),
      uf,
      instagram: instagram.trim(),
      tiktok: tiktok.trim(),
      website: website.trim(),
      whatsapp: whatsapp.replace(/\D/g, "").slice(0, 11),
      primary_role: primaryRole,
      secondary_roles: secondaryRoles,
    };
    if (usernameAlterado && podeTrocarUsername) {
      updates.username = username;
      updates.username_changed_at = new Date().toISOString();
    }
    const { error: updateError } = await supabase
      .from("profiles").update(updates).eq("id", profile.id);
    setSaving(false);
    if (updateError) { setError("Erro ao salvar. Tente novamente."); return; }
    setSuccess(true);
    setTimeout(() => router.push(`/perfil/${updates.username ?? profile.username}`), 1200);
  }

  return (
    <div className="ed-page">
      <div className="ed-card">

        <div className="ed-header">
          <button className="ed-back" onClick={() => router.back()}>← Voltar</button>
          <h1>Editar perfil</h1>
        </div>

        <div className="ed-avatar-row">
          <div className="ed-avatar-wrap" onClick={() => fileInputRef.current?.click()}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="ed-avatar" />
            ) : (
              <div className="ed-avatar ed-avatar-fallback">
                {displayName?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="ed-avatar-overlay">{uploadingAvatar ? "⏳" : "📷"}</div>
          </div>
          <div>
            <p className="ed-avatar-hint">Clique na foto para alterar</p>
            <p className="ed-avatar-hint">JPG, PNG ou WEBP · máx 2MB</p>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
        </div>

        <div className="ed-divider" />

        <section className="ed-section">
          <h2>Identidade</h2>
          <div className="ed-field">
            <label>Nome</label>
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Seu nome" maxLength={60} />
          </div>
          <div className="ed-field">
            <label>
              Username
              {!podeTrocarUsername && <span className="ed-badge-locked">🔒 disponível em {diasRestantes} dias</span>}
            </label>
            <div className="ed-username-wrap">
              <span className="ed-username-prefix">@</span>
              <input type="text" value={username} onChange={(e) => checkUsername(e.target.value)} placeholder="seu_nome" maxLength={30} disabled={!podeTrocarUsername} />
              {checkingUsername && <span className="ed-username-status">...</span>}
              {!checkingUsername && usernameAlterado && !usernameError && username.length >= 3 && (
                <span className="ed-username-status ok">✓</span>
              )}
            </div>
            {usernameError && <p className="ed-field-error">{usernameError}</p>}
            <p className="ed-field-hint">Apenas letras minúsculas, números e _</p>
          </div>
          <div className="ed-field">
            <label>Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Conte um pouco sobre você..." maxLength={200} rows={3} />
            <p className="ed-field-hint">{bio.length}/200</p>
          </div>
          <div className="ed-row">
            <div className="ed-field">
              <label>Cidade</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Sua cidade" />
            </div>
            <div className="ed-field">
              <label>Estado</label>
              <select value={uf} onChange={(e) => setUf(e.target.value)}>
                <option value="">UF</option>
                {UFS.map((u) => <option key={u} value={u.toLowerCase()}>{u}</option>)}
              </select>
            </div>
          </div>
        </section>

        <div className="ed-divider" />

        <section className="ed-section">
          <h2>Links e contato</h2>
          <div className="ed-field">
            <label>💬 WhatsApp</label>
            <div className="ed-input-prefix-wrap">
              <span className="ed-input-prefix">+55</span>
              <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="81999990000" />
            </div>
            <p className="ed-field-hint">Só números com DDD · ex: 81999990000</p>
          </div>
          <div className="ed-field">
            <label>📷 Instagram</label>
            <div className="ed-input-prefix-wrap">
              <span className="ed-input-prefix">@</span>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="seu_perfil" />
            </div>
          </div>
          <div className="ed-field">
            <label>🎵 TikTok</label>
            <div className="ed-input-prefix-wrap">
              <span className="ed-input-prefix">@</span>
              <input type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="seu_perfil" />
            </div>
          </div>
          <div className="ed-field">
            <label>🌐 Website</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://seusite.com" />
          </div>
        </section>

        <div className="ed-divider" />

        <section className="ed-section">
          <h2>Características</h2>
          <p className="ed-section-sub">1 principal + até 2 secundárias</p>
          <h3>Principal</h3>
          {CATS.map((cat) => (
            <div key={cat} className="ed-cat">
              <span className="ed-cat-label">{cat}</span>
              <div className="ed-tags">
                {ROLES.filter((r) => r.cat === cat).map((role) => (
                  <button key={role.id} className={`ed-tag ${primaryRole === role.id ? "ed-tag-pri" : ""}`}
                    onClick={() => { setPrimaryRole(role.id); setSecondaryRoles((prev) => prev.filter((r) => r !== role.id)); setError(null); }}>
                    {role.emoji} {role.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {primaryRole && (
            <>
              <h3 style={{ marginTop: "1.25rem" }}>Secundárias <span className="ed-optional">({secondaryRoles.length}/2)</span></h3>
              {CATS.map((cat) => {
                const available = ROLES.filter((r) => r.cat === cat && r.id !== primaryRole);
                if (!available.length) return null;
                return (
                  <div key={cat} className="ed-cat">
                    <span className="ed-cat-label">{cat}</span>
                    <div className="ed-tags">
                      {available.map((role) => (
                        <button key={role.id}
                          className={`ed-tag ${secondaryRoles.includes(role.id) ? "ed-tag-sec" : ""} ${secondaryRoles.length >= 2 && !secondaryRoles.includes(role.id) ? "ed-tag-disabled" : ""}`}
                          onClick={() => toggleSecondary(role.id)}>
                          {role.emoji} {role.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </section>

        <div className="ed-divider" />

        {error && <p className="ed-error">{error}</p>}
        {success && <p className="ed-success">✓ Perfil salvo! Redirecionando...</p>}

        <button className="ed-save-btn" onClick={handleSave} disabled={saving || success}>
          {saving ? "Salvando..." : "Salvar perfil"}
        </button>

      </div>
    </div>
  );
}