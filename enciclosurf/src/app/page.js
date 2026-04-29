"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Filters from "../components/filters/Filters";
import { getPicos } from "../services/supabase/picosService";

export default function Home() {
  const [picos, setPicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("todos");
  const [filterCountry, setFilterCountry] = useState("todos");
  const [selectedPico, setSelectedPico] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getPicos();
      setPicos(data);
      setLoading(false);
    }

    load();
  }, []);

  const filteredPicos = picos.filter((pico) => {
    const matchSearch =
      pico.nome.toLowerCase().includes(search.toLowerCase()) ||
      pico.descricao.toLowerCase().includes(search.toLowerCase());

    const matchDifficulty =
      filterDifficulty === "todos" ||
      pico.dificuldade === filterDifficulty;

    const matchCountry =
      filterCountry === "todos" ||
      pico.pais === filterCountry;

    return matchSearch && matchDifficulty && matchCountry;
  });

  return (
    <>
      <Header />

      <Hero search={search} 
            setSearch={setSearch}
            picos={picos}
            />

      <main className="content-body">

        <Filters
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          filterCountry={filterCountry}
          setFilterCountry={setFilterCountry}
        />

        <h1>🌊 Picos de Surf</h1>

        <div className="picos-grid">
          {filteredPicos.map((pico) => (
            <div key={pico.id}
            className="pico-card"
            onClick={() => router.push(`/pico/${pico.id}`)}
            >
              <img src={pico.imagem} alt={pico.nome} />

              <div className="picos-text">
                <h3>{pico.nome}</h3>
                <p>{pico.descricao}</p>
                <span className="preco">R$ {pico.preco}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedPico && (
  <div className="pico-panel">

    <h2>📍 {selectedPico.nome}</h2>

    <div className="cards">

      <div className="card-pico">
        <h3>🌊 Previsão</h3>
        <p>Altura: 1.2m • Período: 12s • Vento: Offshore</p>
        <button
            onClick={(e) => {
                e.stopPropagation();
                router.push(`/pico/${selectedPico.id}`);
            }}
            >
            Ver mais
        </button>
      </div>

      <div className="card-pico">
        <h3>📖 Informações</h3>
        <p>Pico ideal para intermediários com fundo de areia</p>
          <button
            onClick={(e) => {
                e.stopPropagation();
                router.push(`/pico/${selectedPico.id}`);
            }}
            >
            Ver mais
        </button>
      </div>

      <div className="card-pico">
        <h3>✈️ Viagens</h3>
        <p>Hospedagens próximas a partir de R$ 120</p>
           <button
            onClick={(e) => {
                e.stopPropagation();
                router.push(`/pico/${selectedPico.id}`);
            }}
            >
            Ver mais
        </button>
      </div>

    </div>
            
  </div>
)}

        

      </main>
    </>
  );
}

