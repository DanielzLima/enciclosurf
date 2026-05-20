export function formatWave(wave = 0) {
  if (wave < 0.5) return "Pequeno";
  if (wave < 1) return "Meio metro";
  if (wave < 2) return "Bom";
  return "Grande";
}

export function getDirectionFull(deg = 0) {
  const dirs = [
    ["N", "Norte"],
    ["NNE", "Norte-Nordeste"],
    ["NE", "Nordeste"],
    ["ENE", "Leste-Nordeste"],
    ["E", "Leste"],
    ["ESE", "Leste-Sudeste"],
    ["SE", "Sudeste"],
    ["SSE", "Sul-Sudeste"],
    ["S", "Sul"],
    ["SSW", "Sul-Sudoeste"],
    ["SW", "Sudoeste"],
    ["WSW", "Oeste-Sudoeste"],
    ["W", "Oeste"],
    ["WNW", "Oeste-Noroeste"],
    ["NW", "Noroeste"],
    ["NNW", "Norte-Noroeste"],
  ];

  const index = Math.round(deg / 22.5) % 16;

  return {
    short: dirs[index]?.[0] || "N/A",
    full: dirs[index]?.[1] || "N/A",
  };
}