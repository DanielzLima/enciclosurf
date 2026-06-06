"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createSpotRequest } from "../services/supabase/spotRequestService";
import { uploadSpotImage } from "../services/supabase/uploadService";
import AuthModal from "./AuthModal";

const SPOT_TAGS = [
  { slug: "acesso-facil",    label: "Acesso fácil",       emoji: "🚗", cat: "Acesso" },
  { slug: "acesso-dificil",  label: "Acesso difícil",     emoji: "⚠️", cat: "Acesso" },
  { slug: "trilha",          label: "Pega trilha",        emoji: "🥾", cat: "Acesso" },
  { slug: "estacionamento",  label: "Tem estacionamento", emoji: "🅿️", cat: "Acesso" },
  { slug: "acesso-barco",    label: "Acesso de barco",    emoji: "⛵", cat: "Acesso" },
  { slug: "onda-facil",      label: "Onda fácil",         emoji: "😊", cat: "Onda" },
  { slug: "onda-pesada",     label: "Onda pesada",        emoji: "💪", cat: "Onda" },
  { slug: "onda-rara",       label: "Onda rara",          emoji: "💎", cat: "Onda" },
  { slug: "tubo",            label: "Dá tubo",            emoji: "🌀", cat: "Onda" },
  { slug: "onda-longa",      label: "Onda longa",         emoji: "📏", cat: "Onda" },
  { slug: "fechada",         label: "Fecha muito",        emoji: "🚫", cat: "Onda" },
  { slug: "fundo-areia",     label: "Fundo areia",        emoji: "🏖️", cat: "Fundo" },
  { slug: "fundo-pedra",     label: "Fundo pedra",        emoji: "🪨", cat: "Fundo" },
  { slug: "fundo-coral",     label: "Fundo coral",        emoji: "🪸", cat: "Fundo" },
  { slug: "fundo-recife",    label: "Recife raso",        emoji: "⚡", cat: "Fundo" },
  { slug: "muita-corrente",  label: "Muita corrente",     emoji: "🌊", cat: "Ambiente" },
  { slug: "crowd-pesado",    label: "Crowd pesado",       emoji: "👥", cat: "Ambiente" },
  { slug: "crowd-vazio",     label: "Sempre vazio",       emoji: "🏄", cat: "Ambiente" },
  { slug: "agua-cristalina", label: "Água cristalina",    emoji: "💎", cat: "Ambiente" },
  { slug: "poluicao",        label: "Poluição",           emoji: "⚠️", cat: "Ambiente" },
  { slug: "iniciante",       label: "Bom pra iniciante",  emoji: "🟢", cat: "Nível" },
  { slug: "intermediario",   label: "Intermediário",      emoji: "🟡", cat: "Nível" },
  { slug: "avancado",        label: "Avançado",           emoji: "🔴", cat: "Nível" },
  { slug: "locals-only",     label: "Locals only",        emoji: "🤙", cat: "Nível" },
];

const CATS = [...new Set(SPOT_TAGS.map((t) => t.cat))];

// Toast global de pontos
function PointsToast({ message, visible }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed",
      bottom: 80,
      left: "50%",
      transform: "translateX(-50%)",
      background: "linear-gradient(135deg, #0f172a, #1e293b)",
      border: "1px solid rgba(14,165,233,0.4)",
      borderRadius: 12,
      padding: "10px 18px",
      zIndex: 99999,
      color: "#38bdf8",
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: "nowrap",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      animation: "fadeUp 0.3s ease",
    }}>
      {message}
    </div>
  );
}

export default function AddSpotModal({ open, onClose }) {
  const [nome, setNome] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [tagError, setTagError] = useState(null);
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  if (!open) return null;

  function showToast(msg) {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }

  function toggleTag(slug) {
    setTagError(null);
    setSelectedTags((prev) => {
      if (prev.includes(slug)) return prev.filter((t) => t !== slug);
      if (prev.length >= 3) { setTagError("Selecione no máximo 3 características."); return prev; }
      return [...prev, slug];
    });
  }

  function handleGetLocation() {
    if (!navigator.geolocation) { alert("Geolocalização não suportada"); return; }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLat(pos.coords.latitude); setLng(pos.coords.longitude); setLocationCaptured(true); setLocationLoading(false); },
      () => { alert("Não foi possível obter localização"); setLocationLoading(false); }
    );
  }

  async function handleSubmit() {
    if (!nome.trim()) { alert("Coloca o nome do pico."); return; }
    if (selectedTags.length === 0) { alert("Selecione pelo menos 1 característica."); return; }
    if (!lat || !lng) { alert("Capture a localização do pico."); return; }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setShowLogin(true); return; }

    setLoading(true);
    try {
      let imageUrl = null;
      if (file) imageUrl = await uploadSpotImage(file);

      const descricao = selectedTags
        .map((slug) => SPOT_TAGS.find((t) => t.slug === slug)?.label)
        .filter(Boolean).join(", ");

      const result = await createSpotRequest({
        nome: nome.trim(), descricao, lat, lng, imagem: imageUrl,
      });

      // verifica se este usuário já apoiou antes — ÚNICA verificação de spam
      const { count: apoiosAnteriores } = await supabase
        .from("spot_request_supports")
        .select("id", { count: "exact", head: true })
        .eq("spot_request_id", result.spot.id)
        .eq("user_id", user.id);

      const jaApoiouAntes = (apoiosAnteriores ?? 0) > 0;

      // registra apoio (upsert — ignora se já existe)
      await supabase
        .from("spot_request_supports")
        .upsert(
          { spot_request_id: result.spot.id, user_id: user.id },
          { onConflict: "spot_request_id,user_id", ignoreDuplicates: true }
        );

      // salva tags
      const { data: tagRows } = await supabase
        .from("spot_tags").select("id, slug").in("slug", selectedTags);

      if (tagRows?.length && result.spot?.id) {
        await supabase.from("spot_request_tag_votes").upsert(
          tagRows.map((tag) => ({
            spot_request_id: result.spot.id,
            tag_id: tag.id,
            user_id: user.id,
          })),
          { onConflict: "spot_request_id,tag_id,user_id", ignoreDuplicates: true }
        );
      }

      // PONTOS — só se não apoiou antes
      if (!jaApoiouAntes) {
        await supabase.rpc("add_contribution_points", {
          p_user_id: user.id,
          p_action: "new_spot",
          p_ref_id: result.spot.id,
        });
        showToast("🤙 +20 pontos de contribuição!");
      }

      // mensagem e redirect
      if (result.duplicated) {
        if (jaApoiouAntes) {
          alert("Você já apoiou este pico! Tags atualizadas 🤙");
        } else {
          alert(`🤙 Obrigado por apoiar este pico!\nSuas tags foram registradas.`);
        }
        // redireciona para a página do pico se existir slug
        if (result.spot?.slug) {
          window.location.href = `/pico/${result.spot.slug}`;
          return;
        }
      } else {
        alert("🌊 Pico sugerido com sucesso! Obrigado pela contribuição 🤙");
      }

      setNome(""); setSelectedTags([]); setFile(null);
      setLat(""); setLng(""); setLocationCaptured(false);
      onClose();

    } catch (error) {
      console.error(error);
      alert("Erro ao enviar sugestão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showLogin && <AuthModal onClose={() => setShowLogin(false)} />}
      <PointsToast message={toastMsg} visible={toastVisible} />

      <div className="modal-overlay">
        <div className="modal" style={{ maxHeight: "90vh", overflowY: "auto" }}>
          <div className="modal-header">
            <h2>🌊 Sugerir novo pico</h2>
            <p>Ajude a expandir o mapa da comunidade</p>
          </div>

          <div className="modal-body">
            <input
              className="modal-input"
              placeholder="Nome do pico"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <div style={{ marginTop: 4 }}>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
                Características do pico
                <span style={{ marginLeft: 8, fontSize: 11, color: selectedTags.length === 3 ? "#f59e0b" : "#64748b" }}>
                  {selectedTags.length}/3 selecionadas
                </span>
              </p>

              {CATS.map((cat) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "#475569", marginBottom: 6 }}>
                    {cat}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {SPOT_TAGS.filter((t) => t.cat === cat).map((tag) => {
                      const ativo = selectedTags.includes(tag.slug);
                      const desabilitado = !ativo && selectedTags.length >= 3;
                      return (
                        <button
                          key={tag.slug}
                          onClick={() => toggleTag(tag.slug)}
                          disabled={desabilitado}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            padding: "5px 11px", borderRadius: 999, fontSize: 12,
                            fontWeight: ativo ? 600 : 400,
                            border: ativo ? "1.5px solid #0ea5e9" : "1px solid rgba(255,255,255,0.1)",
                            background: ativo ? "rgba(14,165,233,0.15)" : "rgba(255,255,255,0.04)",
                            color: ativo ? "#38bdf8" : desabilitado ? "#334155" : "var(--muted)",
                            cursor: desabilitado ? "not-allowed" : "pointer",
                          }}
                        >
                          {tag.emoji} {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {tagError && <p style={{ fontSize: 12, color: "#f87171", marginTop: 4 }}>{tagError}</p>}
            </div>

            <button type="button" className="location-btn" onClick={handleGetLocation}>
              {locationLoading ? "Capturando..." : "📍 Usar localização atual"}
            </button>
            {locationCaptured && <p className="location-success">✔ Localização capturada</p>}

            <label className="upload-box">
              <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files[0])} />
              <span>{file ? `📸 ${file.name}` : "📸 Adicionar foto do pico"}</span>
            </label>
          </div>

          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Enviando..." : "Enviar sugestão"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}