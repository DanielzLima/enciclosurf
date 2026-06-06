import { getPicoBySlug } from "../../../services/supabase/picosService";
import ForecastChart from "../../../components/ForecastChart";
import Map from "../../../components/Map";
import ReportButtons from "../../../components/ReportButtons";
import PicoSupport from "../../../components/PicoSupport";
import "../pico.css";
import Script from "next/script";
import { getMarineForecast, getTideData } from "../../../services/forecast/forecastService";
import { formatWave, getDirectionFull } from "../../../utils/surfFormatters";
import { getTodayReports, getYesterdayReports } from "../../../services/supabase/reportsService";
import { createClient } from "../../../lib/supabase/server";
import PicoTags from "../../../components/PicoTags";
import PicoTagsTop from "../../../components/PicoTagsTop";
import PicoTagsVotar from "../../../components/PicoTagsVotar";
import RecentReports from "../../../components/RecentReports";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pico = await getPicoBySlug(slug);
  if (!pico) return { title: "Pico não encontrado | Enciclosurf" };

  return {
    title: `${pico.nome}, ${pico.uf}: Surf, Previsão e Condições do Mar | Enciclosurf`,
    description: `Veja previsão do mar, swell, vento e reports da comunidade em ${pico.nome}, ${pico.cidade} - ${pico.uf}.`,
    openGraph: {
      title: `${pico.nome} | Enciclosurf`,
      description: `Veja como está o mar hoje em ${pico.nome}.`,
      images: [{ url: pico.imagem, width: 1200, height: 630 }],
      type: "website",
    },
  };
}

export default async function PicoPage({ params }) {
  const { slug } = await params;

  const pico = await getPicoBySlug(slug);
  if (!pico) return <h1>Pico não encontrado</h1>;

  // SUPABASE SERVER — busca usuário logado
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // VERIFICA SE JÁ APOIOU O PICO
  let jaApoiouPico = false;
  if (user) {
    const { data: apoio } = await supabase
      .from("pico_supports")
      .select("id")
      .eq("pico_id", pico.id)
      .eq("user_id", user.id)
      .single();
    jaApoiouPico = !!apoio;
  }

  const { data: tagVotes } = await supabase
  .from("spot_tag_votes")
  .select("tag_id, spot_tags(label, emoji, slug)")
  .eq("pico_id", pico.id);

const contagemTags = {};
(tagVotes || []).forEach((v) => {
  const id = v.tag_id;
  if (!contagemTags[id]) {
    contagemTags[id] = { ...v.spot_tags, votos: 0 };
  }
  contagemTags[id].votos++;
});

const topTags = Object.values(contagemTags)
  .sort((a, b) => b.votos - a.votos)
  .slice(0, 4);

// verifica se o usuário já votou em tags neste pico
let jaVotouTags = false;
if (user) {
  const { data: votoExistente } = await supabase
    .from("spot_tag_votes")
    .select("id")
    .eq("pico_id", pico.id)
    .eq("user_id", user.id)
    .limit(1)
    .single();
  jaVotouTags = !!votoExistente;
}

  // FORECAST
  const marineForecast = await getMarineForecast(pico.lat, pico.lng);
  const tideData = await getTideData(pico.uf);

  const currentWave = marineForecast?.hourly?.wave_height?.[0] || 0;
  const currentPeriod = marineForecast?.hourly?.wave_period?.[0] || 0;
  const currentDirection = marineForecast?.hourly?.wave_direction?.[0] || 0;
  const direction = getDirectionFull(currentDirection);
  const energy = currentWave * currentPeriod;
  const nextWave = marineForecast?.hourly?.wave_height?.[1] || 0;

  const forecastTags = [];
  if (energy >= 20) forecastTags.push("⚡ Energia alta");
  if (currentPeriod >= 12) forecastTags.push("🌊 Swell consistente");
  if (currentWave >= 1.5 && currentPeriod >= 10) forecastTags.push("🔥 Potencial clássico");
  if (currentWave < 0.7) forecastTags.push("🔴 Pequeno");
  if (nextWave > currentWave) forecastTags.push("📈 Swell subindo");

  let energyLabel = "Baixa energia";
  if (energy >= 10) energyLabel = "Média energia";
  if (energy >= 20) energyLabel = "Alta energia";

  // DADOS DO GRÁFICO
  const forecastData = marineForecast?.hourly?.time?.slice(0, 168).map((time, index) => {
    const wave = marineForecast?.hourly?.wave_height?.[index] ?? 0;
    const period = marineForecast?.hourly?.wave_period?.[index] ?? 0;
    const dir = marineForecast?.hourly?.wave_direction?.[index] ?? 0;
    const windSpeed = marineForecast?.hourly?.wind_speed?.[index] ?? null;
    const windDir = marineForecast?.hourly?.wind_direction?.[index] ?? 0;
    const dt = new Date(time);
    const dataCompleta = dt.toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
    }).replace(",", "");
    return {
      hora: dt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      dataCompleta,
      swell: Number(wave),
      periodo: Number(period),
      direcao: Number(dir),
      windSpeed: windSpeed ? Math.round(windSpeed) : null,
      windDir: Number(windDir),
    };
  }) || [];

  // VENTO ATUAL
  const currentWindSpeed = marineForecast?.hourly?.wind_speed?.[0] ?? null;
  const currentWindDir = marineForecast?.hourly?.wind_direction?.[0] ?? 0;
  const windDirection = getDirectionFull(currentWindDir);
  const windLabel = currentWindSpeed
    ? `${Math.round(currentWindSpeed)} km/h ${windDirection.short}`
    : "Sem dados";

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

  function getStatus(reports) {
    if (reports.length === 0) return "Sem dados";
    const avg = reports.reduce((acc, r) => acc + r.rating, 0) / reports.length;
    if (avg <= 1.5) return "🔴 Flat";
    if (avg <= 2.3) return "🟡 Boas";
    return "🟢 Clássico";
  }

  function getTrend(today, yesterday) {
    if (!today.length || !yesterday.length) return "➖ Estável";
    const avgToday = today.reduce((acc, r) => acc + r.rating, 0) / today.length;
    const avgYesterday = yesterday.reduce((acc, r) => acc + r.rating, 0) / yesterday.length;
    if (avgToday > avgYesterday) return "📈 Melhorando";
    if (avgToday < avgYesterday) return "📉 Piorando";
    return "➖ Estável";
  }

  const todayStatus = getStatus(todayReports);
  const trend = getTrend(todayReports, yesterdayReports);
  const totalReports = todayReports.length;

  const classicCount = todayReports.filter((r) => r.rating === 3).length;
  const goodCount = todayReports.filter((r) => r.rating === 2).length;
  const flatCount = todayReports.filter((r) => r.rating === 1).length;

  const classicPercent = totalReports ? Math.round((classicCount / totalReports) * 100) : 0;
  const goodPercent = totalReports ? Math.round((goodCount / totalReports) * 100) : 0;
  const flatPercent = totalReports ? Math.round((flatCount / totalReports) * 100) : 0;

  const dayTags = [];
  if (todayStatus.includes("Clássico")) dayTags.push("🔥 Clássico");
  if (todayStatus.includes("Boas")) dayTags.push("🟡 Boas condições");
  if (todayStatus.includes("Flat")) dayTags.push("🔴 Flat");
  if (energy >= 20) dayTags.push("⚡ Mar pesado");
  if (energy >= 10 && energy < 20) dayTags.push("🌊 Swell sólido");
  if (currentPeriod >= 12) dayTags.push("🧼 Linhas perfeitas");

  return (
    <>
      <Script
        id="schema-pico"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="content-body">
        <section className="pico-hero">
          <div className="pico-hero-overlay" />

          <div className="pico-title">
            <div className="pico-header">
              <div className="pico-title-block">
                  <h1>{pico.nome}</h1>
                  <p className="pico-location">
                    {pico.cidade?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}, {pico.uf?.toUpperCase()} • {pico.pais?.toUpperCase()}
                  </p>
                  {/* Tags no topo + botão apoiar */}
                  <PicoTagsTop
                    picoId={pico.id}
                    tags={topTags}
                    initialCount={pico.support_count ?? 0}
                    currentUserId={user?.id ?? null}
                    jaApoiou={jaApoiouPico}
                  />
                </div>

              <div className="vote-box">
                <div className="vote-box-text">
                  <span className="live-dot"></span>
                  <div>
                    <h3>Como está o mar hoje?</h3>
                    <p>Ajude a comunidade compartilhando as condições do mar.</p>
                  </div>
                </div>
                <ReportButtons spotId={pico.id} />
              </div>
            </div>
          </div>

          <div className="pico-top-grid">
            <div className="pico-media">
              <img src={pico.imagem} alt={pico.nome} />
            </div>

            <div className="pico-side">
              <div className="pico-map-wrapper">
                <Map lat={pico.lat} lng={pico.lng} />
              </div>

              <div className="pico-status">

  <div className="status-card">🌊 {todayStatus}</div>
  <div className="status-card">📈 {trend}</div>
  <div className="status-card">💨 {windLabel}</div>
  <div className="status-card">
    🌊 {currentWave.toFixed(1)}m · {currentPeriod}s · {direction.short}
  </div>

  {/* community-score ocupa largura total — span 2 colunas */}
  <div className="community-score community-score-full">
    <h3>🌊 Report da comunidade</h3>

    <div className="community-score-inner">
      {/* ESQUERDA — barras */}
      <div className="community-score-bars">
        <div className="score-bars">
          <div className="score-item">
            <div className="score-label">
              <span>🌊 Clássico</span>
              <strong>{classicPercent}%</strong>
            </div>
            <div className="score-bar">
              <div className="score-fill classic" style={{ width: `${classicPercent}%` }} />
            </div>
          </div>
          <div className="score-item">
            <div className="score-label">
              <span>🟡 Boas</span>
              <strong>{goodPercent}%</strong>
            </div>
            <div className="score-bar">
              <div className="score-fill good" style={{ width: `${goodPercent}%` }} />
            </div>
          </div>
          <div className="score-item">
            <div className="score-label">
              <span>🔴 Flat</span>
              <strong>{flatPercent}%</strong>
            </div>
            <div className="score-bar">
              <div className="score-fill flat" style={{ width: `${flatPercent}%` }} />
            </div>
          </div>
        </div>
        <p className="community-total">{totalReports} reports hoje</p>
      </div>

      {/* DIREITA — reports recentes */}
      <div className="community-score-reports">
        <RecentReports spotId={pico.id} />
      </div>
    </div>

  </div>

</div>
            </div>
          </div>
        </section>

        {/* PREVISÃO */}
        <section className="forecast-section">
          <div className="forecast-header">
            <div>
              <h2>Previsão do Mar</h2>
              <p>Janela prevista para os próximos 7 dias</p>
              <div className="forecast-tags">
                {forecastTags.map((tag) => (
                  <span key={tag} className="forecast-tag">{tag}</span>
                ))}
              </div>
            </div>
            <div className="forecast-badges">
              <span>🌊 {currentWave}m</span>
              <span>⏱️ {currentPeriod}s</span>
              <span>🧭 {direction.short} - {direction.full}</span>
              <span>⚡ {energyLabel}</span>
            </div>
          </div>

          <div className="forecast-grid">
            <div className="forecast-chart-card">
              <ForecastChart data={forecastData} />
            </div>

            <div className="forecast-info-card">
              <h3>🌊 Tábua de Maré</h3>
              <div className="tide-list">
                {tideData.map((tide, i) => {
                  const dt = new Date(tide.time);
                  const hora = dt.toLocaleTimeString("pt-BR", {
                    hour: "2-digit", minute: "2-digit", timeZone: "America/Recife",
                  });
                  const tipo = tide.type === "high" ? "⬆️ Maré Alta" : "⬇️ Maré Baixa";
                  const altura = tide.height ? ` · ${tide.height.toFixed(1)}m` : "";
                  return (
                    <div key={i}>
                      <strong>{hora}</strong>
                      <span>{tipo}{altura}</span>
                    </div>
                  );
                })}
              </div>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12 }}>
                {process.env.STORMGLASS_API_KEY ? "Dados reais via Stormglass" : "Dados estimados"}
              </p>
            </div>
          </div>
        </section>

        {/* INFO + APOIO */}
        <section id="info" style={{ marginTop: "40px" }}>
          <div className="pico-info">
            <h2>📖 Sobre o pico</h2>
            <p>{pico.descricao}</p>

            {/* Tags com votação */}
            <PicoTagsVotar
              picoId={pico.id}
              topTags={topTags}
              currentUserId={user?.id ?? null}
              jaVotou={jaVotouTags}
            />
          </div>
        </section>

        {/* VIAGENS */}
        <section id="viagens" style={{ marginTop: "40px" }}>
          <h2>✈️ Viagens & Experiências</h2>
          <div className="cards">
            <div className="card-pico">
              <h3>🏨 Hospedagens</h3>
              <p>Em breve parceiros locais</p>
            </div>
            <div className="card-pico">
              <h3>🌴 Surf Trips</h3>
              <p>Pacotes e experiências</p>
            </div>
            <div className="card-pico">
              <h3>🎉 Eventos</h3>
              <p>Competições e encontros</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}