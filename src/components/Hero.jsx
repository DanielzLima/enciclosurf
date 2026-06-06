"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Hero({
  search, setSearch, picos,
  selectedPico, setSelectedPico, onOpenModal,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!search) { setSuggestions([]); return; }
    const filtered = picos.filter((p) =>
      p.nome.toLowerCase().includes(search.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  }, [search, picos]);

  // verifica login antes de abrir o modal
  async function handleAddSpotClick() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // salva intenção e redireciona para login
      sessionStorage.setItem("pos_login", "add_spot");
      // dispara o modal de login do Header
      window.dispatchEvent(new CustomEvent("open-auth-modal"));
      return;
    }

    onOpenModal();
  }

  return (
    <section className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Escolha seu <span>PICO</span></h1>
        <p>Previsão, comunidade e surftrips em um só lugar</p>

        <div className="search-container">
          <div className="search-box">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pico..."
            />
            <button>Buscar</button>
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((pico) => (
                <div
                  key={pico.id}
                  className="suggestion-item"
                  onClick={() => {
                    setSelectedPico(pico);
                    setSearch(pico.nome);
                    setSuggestions([]);
                  }}
                >
                  <img src={pico.imagem} alt={pico.nome} />
                  <div>
                    <strong>{pico.nome}</strong>
                    <p>{pico.pais}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hero-add-spot">
          <p>Não encontrou seu pico?</p>
          <button onClick={handleAddSpotClick}>
            + Adicionar novo pico
          </button>
        </div>
      </div>
    </section>
  );
}