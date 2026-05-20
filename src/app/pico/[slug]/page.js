import { getPicoBySlug } from "../../../services/supabase/picosService";
import ForecastChart from "../../../components/ForecastChart";
import Map from "../../../components/Map";
import ReportButtons from "../../../components/ReportButtons";
import "../pico.css";
import Script from "next/script";
import { getMarineForecast } from "../../../services/forecast/forecastService";
import { formatWave, getDirectionFull } from "../../../utils/surfFormatters";
import {
  getTodayReports,
  getYesterdayReports,
} from "../../../services/supabase/reportsService";

export async function generateMetadata({
      params
    }) {

  const { slug } = await params;

  const pico = await getPicoBySlug(slug);

  if (!pico) {

    return {
      title: "Pico não encontrado | Enciclosurf",
    };
    
  }

  return {

    title:
      `${pico.nome}, ${pico.uf}: Surf, Previsão e Condições do Mar | Enciclosurf`,

    description:
      `Veja previsão do mar, swell, vento e reports da comunidade em ${pico.nome}, ${pico.cidade} - ${pico.uf}.`,

    openGraph: {

      title:
        `${pico.nome} | Enciclosurf`,

      description:
        `Veja como está o mar hoje em ${pico.nome}.`,

      images: [
        {
          url: pico.imagem,
          width: 1200,
          height: 630,
        },
      ],

      type: "website",
    },

  };

}


export default async function PicoPage({ params }) {

  const { slug } = await params;

  // BUSCA PICO
  const pico = await getPicoBySlug(slug);

    if (!pico) {
      return <h1>Pico não encontrado</h1>;
    }

  const marineForecast =
    await getMarineForecast(
      pico.lat,
      pico.lng
    );

  // DADOS ATUAIS

    const currentWave =
      marineForecast?.hourly?.wave_height?.[0] || 0;

    const currentPeriod =
      marineForecast?.hourly?.wave_period?.[0] || 0;

    const currentDirection =
      marineForecast?.hourly?.wave_direction?.[0] || 0;
      

    const direction =
      getDirectionFull(currentDirection);

      // ENERGIA DO MAR

      const energy =
        currentWave * currentPeriod;

        const forecastTags = [];

        

        // ENERGIA
        if (energy >= 20) {
          forecastTags.push("⚡ Energia alta");
        }

        // SWELL CONSISTENTE
        if (currentPeriod >= 12) {
          forecastTags.push("🌊 Swell consistente");
        }

        // MAR COM POTENCIAL
        if (currentWave >= 1.5 && currentPeriod >= 10) {
          forecastTags.push("🔥 Potencial clássico");
        }

        // SWELL PEQUENO
        if (currentWave < 0.7) {
          forecastTags.push("🔴 Pequeno");
        }

        // MAR SUBINDO
        const nextWave =
          marineForecast?.hourly?.wave_height?.[1] || 0;

        if (nextWave > currentWave) {
          forecastTags.push("📈 Swell subindo");
        }

      let energyLabel =
        "Baixa energia";

      if (energy >= 10) {

        energyLabel =
          "Média energia";
      }

      if (energy >= 20) {

        energyLabel =
          "Alta energia";
      }

      // DADOS DO GRÁFICO

const forecastData =
  marineForecast?.hourly?.time
    ?.slice(0, 24)
    .map((time, index) => {

      const wave = marineForecast?.hourly?.wave_height?.[index] ?? 0;
      const period = marineForecast?.hourly?.wave_period?.[index] ?? 0;
      const windWave = marineForecast?.hourly?.wind_wave_height?.[index] ?? 0;
      const direction = marineForecast?.hourly?.wave_direction?.[index] ?? 0;
      
      const power = wave * period;

      return {
        hora: new Date(time).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),

        swell: Number(wave ?? 0),
        energia: Number(power ?? 0),
        periodo: Number(period ?? 0),
        direcao: Number(direction ?? 0),
        vento: windWave,

      };
    }) || [];
  
  
    // SCHEMA SEO
  const schema = {

  "@context": "https://schema.org",

  "@type": "Place",

  name: pico.nome,

  description: pico.descricao,

  image: pico.imagem,

  address: {

    "@type": "PostalAddress",

    addressRegion: pico.uf,

    addressCountry: "BR",
  },
};
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

    // TAG STATUS

  const dayTags = [];
     
      // STATUS   TAG  

    if (todayStatus.includes("Clássico")) {
      dayTags.push("🔥 Clássico");
    }

    if (todayStatus.includes("Boas")) {
      dayTags.push("🟡 Boas condições");
    }

    if (todayStatus.includes("Flat")) {
      dayTags.push("🔴 Flat");
    }

    // ENERGIA TAG

    if (energy >= 20) {
  dayTags.push("⚡ Mar pesado");
    }

    if (energy >= 10 && energy < 20) {
      dayTags.push("🌊 Swell sólido");
    }
        
    // PERIODO
      if (currentPeriod >= 12) {
      dayTags.push("🧼 Linhas perfeitas");
    }

    

return (
  <>
    <Script
      id="schema-pico"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />

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
          {pico.cidade}, {pico.uf} • {pico.pais}
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
        Janela prevista para as próximas 24h
      </p>
      <div className="forecast-tags">
        {forecastTags.map((tag) => (
          <span
            key={tag}
            className="forecast-tag"
          >
            {tag}
          </span>
          
        ))}

        
      </div>
    </div>

    <div className="forecast-badges">

        <span>
          🌊 {currentWave}m
        </span>

        <span>
          ⏱️ {currentPeriod}s
        </span>

        <span>
          🧭  {direction.short} - {direction.full}
        </span>

        <span>
          ⚡ {energyLabel}
        </span>

      </div>
  </div>

  <div className="forecast-grid">

    <div className="forecast-chart-card">

      <ForecastChart data={forecastData} />

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
    </>
  );
}