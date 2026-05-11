"use client";

import { useState } from "react";

import { createSpotRequest } from "../services/supabase/spotRequestService";
import { uploadSpotImage } from "../services/supabase/uploadService";

export default function AddSpotModal({ open, onClose }) {

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    lat: "",
    lng: "",
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);

  const [locationCaptured, setLocationCaptured] = useState(false);

  if (!open) return null;

  // PEGAR LOCALIZAÇÃO
  function handleGetLocation() {

    if (!navigator.geolocation) {
      alert("Geolocalização não suportada");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(

      (position) => {

        setForm((prev) => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }));

        setLocationCaptured(true);

        setLocationLoading(false);
      },

      () => {

        alert("Não foi possível obter localização");

        setLocationLoading(false);
      }

    );
  }

  // SUBMIT
  async function handleSubmit() {

  // VALIDAÇÃO
  if (
    !form.nome ||
    !form.descricao ||
    !form.lat ||
    !form.lng
  ) {

    alert("Preencha todos os campos e capture a localização");

    return;
  }

  try {

    setLoading(true);

    let imageUrl = null;

    if (file) {
      imageUrl = await uploadSpotImage(file);
    }

    const result = await createSpotRequest({
    ...form,
    imagem: imageUrl,
    });

    if (result?.duplicated) {

    alert(
        `🌊 Esse pico já foi sugerido!\n\n👍 ${result.spot.votes + 1} surfistas apoiaram essa solicitação`
    );

    } else {

    alert("🌊 Pico enviado com sucesso!");

    }

    onClose();

  } catch (err) {

    console.error("ERRO COMPLETO:", err);

    alert(err.message || "Erro ao enviar pico");

  } finally {

    setLoading(false);

  }
}

  return (

    <div className="modal-overlay">

      <div className="modal">

        {/* HEADER */}
        <div className="modal-header">

          <h2>🌊 Sugerir novo pico</h2>

          <p>
            Ajude a expandir o mapa da comunidade
          </p>

        </div>

        {/* BODY */}
        <div className="modal-body">

          {/* NOME */}
          <input
            className="modal-input"
            placeholder="Nome do pico"
            value={form.nome}
            onChange={(e) =>
              setForm({
                ...form,
                nome: e.target.value,
              })
            }
          />

          {/* DESCRIÇÃO */}
          <textarea
            className="modal-textarea"
            placeholder="Descrição do pico..."
            value={form.descricao}
            onChange={(e) =>
              setForm({
                ...form,
                descricao: e.target.value,
              })
            }
          />

          {/* GEOLOCATION */}
          <button
            type="button"
            className="location-btn"
            onClick={handleGetLocation}
          >

            {locationLoading
              ? "Capturando localização..."
              : "📍 Usar localização atual"}

          </button>

          {locationCaptured && (

            <p className="location-success">

              ✔ Localização capturada

            </p>

          )}

          {/* UPLOAD */}
          <label className="upload-box">

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            <span>

              {file
                ? `📸 ${file.name}`
                : "📸 Adicionar imagem do pico"}

            </span>

          </label>

        </div>

        {/* FOOTER */}
        <div className="modal-footer">

          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading
              ? "Enviando..."
              : "Enviar sugestão"}

          </button>

        </div>

      </div>

    </div>
  );
}