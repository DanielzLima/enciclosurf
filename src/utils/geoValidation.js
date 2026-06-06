// utils/geoValidation.js
// Verifica se a coordenada está a menos de 50km do litoral brasileiro
// usando uma lista de pontos costeiros de referência

const PONTOS_LITORAIS = [
  // Nordeste
  { lat: -8.05,  lng: -34.9  }, // Recife
  { lat: -3.7,   lng: -38.5  }, // Fortaleza
  { lat: -5.8,   lng: -35.2  }, // Natal
  { lat: -7.1,   lng: -34.8  }, // João Pessoa
  { lat: -9.6,   lng: -35.7  }, // Maceió
  { lat: -13.0,  lng: -38.5  }, // Salvador
  { lat: -11.0,  lng: -37.1  }, // Aracaju
  // Sudeste
  { lat: -22.9,  lng: -43.2  }, // Rio de Janeiro
  { lat: -23.9,  lng: -46.3  }, // Santos
  { lat: -20.3,  lng: -40.3  }, // Vitória
  // Sul
  { lat: -25.5,  lng: -48.5  }, // Paranaguá
  { lat: -27.5,  lng: -48.5  }, // Florianópolis
  { lat: -30.0,  lng: -51.2  }, // Porto Alegre
  // Norte
  { lat: -0.7,   lng: -48.5  }, // Belém
  { lat: -2.5,   lng: -44.3  }, // São Luís
];

function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function proximoAoLitoral(lat, lng, raioKm = 50) {
  return PONTOS_LITORAIS.some(p =>
    distanciaKm(lat, lng, p.lat, p.lng) <= raioKm
  );
}