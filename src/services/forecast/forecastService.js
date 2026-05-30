// Coordenadas centrais por UF para cache de maré
const UF_COORDS = {
  pe: { lat: -8.05, lng: -34.9 },
  rj: { lat: -22.9, lng: -43.2 },
  sp: { lat: -23.9, lng: -46.3 },
  sc: { lat: -27.5, lng: -48.5 },
  rs: { lat: -30.0, lng: -51.2 },
  ba: { lat: -13.0, lng: -38.5 },
  ce: { lat: -3.7,  lng: -38.5 },
  rn: { lat: -5.8,  lng: -35.2 },
  pb: { lat: -7.1,  lng: -34.8 },
  al: { lat: -9.6,  lng: -35.7 },
  se: { lat: -11.0, lng: -37.1 },
  es: { lat: -20.3, lng: -40.3 },
  pr: { lat: -25.5, lng: -48.5 },
  pa: { lat: -0.7,  lng: -48.5 },
  ma: { lat: -2.5,  lng: -44.3 },
  pi: { lat: -3.0,  lng: -41.8 },
  ap: { lat: -0.0,  lng: -51.0 },
};

export async function getMarineForecast(lat, lng) {
  try {
    // Marine API — ondas e swell (7 dias)
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&hourly=wave_height,wave_direction,wave_period,wind_wave_height,swell_wave_height,swell_wave_direction&timezone=auto&forecast_days=7`;

    // Weather API — vento real (mesma lat/lng)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m&timezone=auto&forecast_days=7`;

    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, { next: { revalidate: 3600 } }),
      fetch(weatherUrl, { next: { revalidate: 3600 } }),
    ]);

    const [marineData, weatherData] = await Promise.all([
      marineRes.json(),
      weatherRes.json(),
    ]);

    // Mescla os dados de vento no objeto marine
    if (marineData?.hourly) {
      marineData.hourly.wind_speed = weatherData?.hourly?.wind_speed_10m || [];
      marineData.hourly.wind_direction = weatherData?.hourly?.wind_direction_10m || [];
      marineData.hourly.wind_gusts = weatherData?.hourly?.wind_gusts_10m || [];
    }

    return marineData;

  } catch (error) {
    console.error("Erro forecast:", error);
    return null;
  }
}

export async function getTideData(uf) {
  const STORMGLASS_KEY = process.env.STORMGLASS_API_KEY;

  if (!STORMGLASS_KEY) {
    console.warn("Stormglass key não configurada — usando dados mock");
    return getMockTide();
  }

  const coords = UF_COORDS[uf?.toLowerCase()] || UF_COORDS.pe;

  // Busca maré para o dia atual (meia noite até meia noite)
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 0);

  try {
    const url = `https://api.stormglass.io/v2/tide/extremes/point?lat=${coords.lat}&lng=${coords.lng}&start=${start.toISOString()}&end=${end.toISOString()}`;

    const res = await fetch(url, {
      headers: { Authorization: STORMGLASS_KEY },
      next: { revalidate: 86400 }, // cache 24h
    });

    const data = await res.json();
    return data?.data || getMockTide();

  } catch (error) {
    console.error("Erro maré:", error);
    return getMockTide();
  }
}

// Fallback quando não tem API key
function getMockTide() {
  const hoje = new Date();
  const fmt = (h, m) => {
    const d = new Date(hoje);
    d.setHours(h, m, 0);
    return d.toISOString();
  };
  return [
    { time: fmt(5, 48),  type: "high", height: 1.8 },
    { time: fmt(12, 15), type: "low",  height: 0.3 },
    { time: fmt(18, 32), type: "high", height: 1.6 },
    { time: fmt(23, 55), type: "low",  height: 0.4 },
  ];
}