/* API PREVISAO DE ONDAS RODANDO NO FRONT-END/* - MODIFICAR PARA RODAR NO SUPABASE  */ 

const lat = -8.314;
const lng = -34.956;
const params = 'windSpeed';

async function buscarDados(){

const response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
  headers: {
    'Authorization': "4bde57c4-3208-11f1-9fff-0242ac120004-4bde5828-3208-11f1-9fff-0242ac120004"
  }
});

const data = await response.json();
console.log(data);

if (!data.hours) {
    console.error("Erro na API:",  data.errors);
    return;
}

const hora = data.hours[0];

const onda = hora.waveHeight.sg;
const periodo = hora.wavePeriod.sg;
const vento = hora.windSpeed.sg;

console.log(`Onda: ${onda}m`);
console.log(`Período: ${periodo}s`);
console.log(`Vento: ${vento}km/h`);

}

buscarDados();