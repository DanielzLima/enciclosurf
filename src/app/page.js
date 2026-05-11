"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommunityFeed from "../components/CommunityFeed";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import AddSpotModal from "../components/AddSpotModal";

import { getPicos } from "../services/supabase/picosService";

export default function Home() {

  const router = useRouter();

  const [picos, setPicos] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedPico, setSelectedPico] = useState(null);

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {

    async function load() {

      const data = await getPicos();

      setPicos(data);
    }

    load();

  }, []);

  return (
    <>
      <Header />

      <Hero
        search={search}
        setSearch={setSearch}
        picos={picos}
        selectedPico={selectedPico}
        setSelectedPico={setSelectedPico}
        onOpenModal={() => setOpenModal(true)}
      />

      {/* CARDS DO PICO */}
      {selectedPico && (

        <section className="selected-pico-section">

          <div className="content-body">

            <div className="hero-cards">

              <h2>
                📍 {selectedPico.nome}
              </h2>

              <div className="cards">

                {/* PREVISÃO */}
                <div
                  className="card-pico"
                  onClick={() =>
                    router.push(`/pico/${selectedPico.slug}#previsao`)
                  }
                >
                  <h3>🌊 Previsão</h3>

                  <p>
                    Veja condição atual, ontem e tendência.
                  </p>
                </div>

                {/* INFO */}
                <div
                  className="card-pico"
                  onClick={() =>
                    router.push(`/pico/${selectedPico.slug}#info`)
                  }
                >
                  <h3>📖 Informações</h3>

                  <p>
                    História do pico, crowd e dicas locais.
                  </p>
                </div>

                {/* VIAGENS */}
                <div
                  className="card-pico"
                  onClick={() =>
                    router.push(`/pico/${selectedPico.slug}#viagens`)
                  }
                >
                  <h3>✈️ Viagens</h3>

                  <p>
                    Trips, hospedagens e experiências.
                  </p>
                </div>
                  
              </div>
                  
            </div>
              <CommunityFeed />
          </div>

        </section>
        
      )}

      {/* MODAL */}
      <AddSpotModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
      
      <Footer />
    </>
  );
}