import { getPicoById } from "../../../services/supabase/picosService";

export default async function PicoPage({ params }) {
  const { id } = await params;

  const pico = await getPicoById(id);

  if (!pico) {
    return <h1>Pico não encontrado</h1>;
  }

  return (
    <main className="content-body">

      <h1>{pico.nome}</h1>

      <img
        src={pico.imagem}
        alt={pico.nome}
        style={{ width: "100%", borderRadius: "12px" }}
      />

      <p>{pico.descricao}</p>

      <div className="cards">

        <div className="card-pico">
          <h3>🌊 Previsão</h3>
          <p>Dados detalhados de ondas em breve</p>
        </div>

        <div className="card-pico">
          <h3>📖 Informações</h3>
          <p>História, nível, crowd, dicas locais</p>
        </div>

        <div className="card-pico">
          <h3>✈️ Viagens</h3>
          <p>Hospedagem, trips e experiências</p>
        </div>

      </div>

    </main>
  );
}