"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Hero({ search, setSearch, picos }) {
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!search) {
      setSuggestions([]);
      return;
    }

    const filtered = picos.filter((p) =>
      p.nome.toLowerCase().includes(search.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 5));
  }, [search, picos]);

  return (
    <section className="hero">
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1>
          Encontre seu próximo <span>pico perfeito</span>
        </h1>

        <p>Previsão, ondas e destinos de surf em um só lugar</p>

        <div className="search-box">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar pico (ex: Pipeline)"
          />
          <button>Buscar</button>
        </div>

        {/* AUTOCOMPLETE */}
        <div className="suggestions">
          {suggestions.map((pico) => (
       <div
            key={pico.id}
            className="suggestion-item"
            onClick={() => {
                setSearch(pico.nome);     //(preenche input)
                setSuggestions([]);       // limpa dropdown
                router.push(`/pico/${pico.id}`); // navega
            }}
            >
            {pico.nome}
        </div>
          ))}
        </div>
      </div>
    </section>
  );
}