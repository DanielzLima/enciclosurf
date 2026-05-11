"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Hero({
  search,
  setSearch,
  picos,
  selectedPico,
  setSelectedPico,
  onOpenModal,
}) {

  const [suggestions, setSuggestions] = useState([]);

  const router = useRouter();

  useEffect(() => {

    if (!search) {
      setSuggestions([]);
      return;
    }

    const filtered = picos.filter((pico) =>
      pico.nome.toLowerCase().includes(search.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));

  }, [search, picos]);

  return (
    <section className="hero">

      <div className="hero-overlay" />

      <div className="hero-content">

        <h1>
          Escolha seu  <span>PICO</span>
        </h1>

        <p>
          Previsão, comunidade e surftrips em um só lugar
        </p>

        {/* BUSCA */}
        <div className="search-container">

          <div className="search-box">

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar pico..."
            />

            <button>
              Buscar
            </button>

          </div>

          {/* SUGESTÕES */}
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

                  <img
                    src={pico.imagem}
                    alt={pico.nome}
                  />

                  <div>

                    <strong>{pico.nome}</strong>

                    <p>{pico.pais}</p>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* CTA ADD SPOT */}
        <div className="hero-add-spot">

          <p>
            Não encontrou seu pico?
          </p>

          <button onClick={onOpenModal}>
            + Adicionar novo pico
          </button>

        </div>

      </div>

    </section>
  );
}