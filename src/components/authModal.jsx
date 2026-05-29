"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function AuthModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Erro ao conectar com Google. Tente novamente.");
      setLoading(false);
    }
    // se deu certo, o Google redireciona automaticamente — não precisa fazer nada aqui
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()} // evita fechar ao clicar dentro
      >
        <button className="auth-modal-close" onClick={onClose}>
          ✕
        </button>

        <img
          src="/Enciclosurf-logo.jpg"
          alt="Enciclosurf"
          className="auth-modal-logo"
        />

        <h2>Bem-vindo ao Enciclosurf</h2>
        <p>Entre para reportar condições, cadastrar picos e conectar com outros surfistas.</p>

        {error && <p className="auth-modal-error">{error}</p>}

        <button
          className="auth-btn-google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? "Conectando..." : "Entrar com Google"}
        </button>

        <p className="auth-modal-terms">
          Ao entrar, você concorda com os termos de uso da plataforma.
        </p>
      </div>
    </div>
  );
}