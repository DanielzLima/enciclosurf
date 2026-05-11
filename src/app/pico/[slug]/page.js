import { getPicoBySlug } from "../../../services/supabase/picosService";
import ForecastChart from "../../../components/ForecastChart";
import Map from "../../../components/Map";
import ReportButtons from "../../../components/ReportButtons";

import {
  getTodayReports,
  getYesterdayReports,
} from "../../../services/supabase/reportsService";

export default async function PicoPage({ params }) {

  const { slug } = await params;

  // BUSCA PICO
  const pico = await getPicoBySlug(slug);

  if (!pico) {
    return <h1>Pico não encontrado</h1>;
  }

  // REPORTS
  const todayReports = await getTodayReports(pico.id);

  const yesterdayReports = await getYesterdayReports(pico.id);

  // STATUS
  function getStatus(reports) {

    if (reports.length === 0) {
      return "Sem dados";
    }

    const avg =
      reports.reduce((acc, r) => acc + r.rating, 0) /
      reports.length;

    if (avg <= 1.5) return "🔴 Flat";

    if (avg <= 2.3) return "🟡 Boas";

    return "🟢 Clássico";

    
  }

  // TENDÊNCIA
  function getTrend(today, yesterday) {

    if (!today.length || !yesterday.length) {
      return "➖ Estável";
    }

    const avgToday =
      today.reduce((acc, r) => acc + r.rating, 0) /
      today.length;

    const avgYesterday =
      yesterday.reduce((acc, r) => acc + r.rating, 0) /
      yesterday.length;

    if (avgToday > avgYesterday) {
      return "📈 Melhorando";
    }

    if (avgToday < avgYesterday) {
      return "📉 Piorando";
    }

    return "➖ Estável";
  }

  const todayStatus = getStatus(todayReports);

  const trend = getTrend(
    todayReports,
    yesterdayReports
  );

  const totalReports =
  todayReports.length;

const classicCount =
  todayReports.filter(
    (r) => r.rating === 3
  ).length;

const goodCount =
  todayReports.filter(
    (r) => r.rating === 2
  ).length;

const flatCount =
  todayReports.filter(
    (r) => r.rating === 1
  ).length;

const classicPercent =
  totalReports
    ? Math.round(
        (classicCount / totalReports) * 100
      )
    : 0;

const goodPercent =
  totalReports
    ? Math.round(
        (goodCount / totalReports) * 100
      )
    : 0;

const flatPercent =
  totalReports
    ? Math.round(
        (flatCount / totalReports) * 100
      )
    : 0;

  // MOCK TEMPORÁRIO
  const forecastMock = [
    { dia: "Seg", onda: 1.2 },
    { dia: "Ter", onda: 1.5 },
    { dia: "Qua", onda: 1.8 },
    { dia: "Qui", onda: 1.3 },
    { dia: "Sex", onda: 1.0 },
  ];

  return (

    <main className="content-body">

      <section className="pico-hero">

        {/* OVERLAY */}
        <div className="pico-hero-overlay" />

        {/* HEADER */}
      <div className="pico-title">

  <div className="pico-header">

    {/* ESQUERDA */}
    <div className="pico-title-block">

      <h1>{pico.nome}</h1>

      <p className="pico-location">
        Pernambuco • Brasil
      </p>

    </div>

    {/* DIREITA */}
    <div className="vote-box">

      <div className="vote-box-text">

        <span className="live-dot"></span>

        <div>

          <h3>
            Como está o mar hoje?
          </h3>

          <p>
            Ajude a comunidade compartilhando as condições do mar.
          </p>

        </div>

      </div>

      <ReportButtons spotId={pico.id} />

    </div>

  </div>

</div>



        {/* GRID PRINCIPAL */}
        <div className="pico-top-grid">

          {/* IMAGEM */}
          <div className="pico-media">

            <img
              src={pico.imagem}
              alt={pico.nome}
            />

          </div>

          
    

          {/* LATERAL */}
          <div className="pico-side">

            <div className="pico-map-wrapper">

              <Map
                lat={pico.lat}
                lng={pico.lng}
              />

            </div>

            {/* STATUS */}
            <div className="pico-status">

              <div className="status-card">
                🌊 {todayStatus}
              </div>

              <div className="status-card">
                📈 {trend}
              </div>

              <div className="status-card">
                💨 Offshore
              </div>

              <div className="status-card">
                👥 Crowd médio
              </div>

              <div className="community-score">

  <h3>
    🌊 Report da comunidade
  </h3>

  <div className="score-bars">

    <div className="score-item">

      <div className="score-label">
        <span>🌊 Clássico</span>
        <strong>
          {classicPercent}%
        </strong>
      </div>

      <div className="score-bar">
        <div
          className="score-fill classic"
          style={{
            width: `${classicPercent}%`
          }}
        />
      </div>

    </div>

    <div className="score-item">

      <div className="score-label">
        <span>🟡 Boas</span>
        <strong>
          {goodPercent}%
        </strong>
      </div>

      <div className="score-bar">
        <div
          className="score-fill good"
          style={{
            width: `${goodPercent}%`
          }}
        />
      </div>

    </div>

    <div className="score-item">

      <div className="score-label">
        <span>🔴 Flat</span>
        <strong>
          {flatPercent}%
        </strong>
      </div>

      <div className="score-bar">
        <div
          className="score-fill flat"
          style={{
            width: `${flatPercent}%`
          }}
        />
      </div>

    </div>

  </div>

  <p className="community-total">
    {totalReports} reports hoje
  </p>

</div>

            </div>

          </div>

        </div>

      </section>
        {/* PREVISÃO FULL */}
<section className="forecast-section">

  <div className="forecast-header">

    <div>
      <h2>Previsão do Mar</h2>

      <p>
        Condições previstas para os próximos dias
      </p>
    </div>

    <div className="forecast-badges">

      <span>🌊 Swell Sul</span>

      <span>💨 Offshore</span>

      <span>⚡ Média energia</span>

    </div>

  </div>

  <div className="forecast-grid">

    <div className="forecast-chart-card">

      <ForecastChart data={forecastMock} />

    </div>

    <div className="forecast-info-card">

      <h3>🌊 Tábua de Maré</h3>

      <div className="tide-list">

        <div>
          <strong>06:12</strong>
          <span>Maré Alta</span>
        </div>

        <div>
          <strong>12:48</strong>
          <span>Maré Baixa</span>
        </div>

        <div>
          <strong>18:20</strong>
          <span>Maré Alta</span>
        </div>

      </div>

    </div>

  </div>

</section>

  
      {/* INFO */}
      <section
        id="info"
        style={{ marginTop: "40px" }}
      >

        <div className="pico-info">

          <h2>
            📖 Sobre o pico
          </h2>

          <p>
            {pico.descricao}
          </p>

          <p>
            {pico.nome} é um pico localizado no litoral
            de Pernambuco, conhecido por suas condições
            variáveis e sessões clássicas em dias de
            swell consistente.
          </p>

          <p>
            Além do surf, a região possui opções de
            hospedagem, gastronomia e experiências
            ligadas ao lifestyle praiano.
          </p>

        </div>

      </section>

      {/* VIAGENS */}
      <section
        id="viagens"
        style={{ marginTop: "40px" }}
      >

        <h2>
          ✈️ Viagens & Experiências
        </h2>

        <div className="cards">

          <div className="card-pico">

            <h3>
              🏨 Hospedagens
            </h3>

            <p>
              Em breve parceiros locais
            </p>

          </div>

          <div className="card-pico">

            <h3>
              🌴 Surf Trips
            </h3>

            <p>
              Pacotes e experiências
            </p>

          </div>

          <div className="card-pico">

            <h3>
              🎉 Eventos
            </h3>

            <p>
              Competições e encontros
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}