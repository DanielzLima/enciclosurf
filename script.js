/* API PREVISAO DE ONDAS RODANDO NO FRONT-END/* - MODIFICAR PARA RODAR NO SUPABASE  */ 

// const lat = -8.314;
// const lng = -34.956;
// const params = 'windSpeed';

// async function buscarDados(){

// const response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
//   headers: {
//     'Authorization': "4bde57c4-3208-11f1-9fff-0242ac120004-4bde5828-3208-11f1-9fff-0242ac120004"
//   }
// });

// const data = await response.json();
// console.log(data);

// if (!data.hours) {
//     console.error("Erro na API:",  data.errors);
//     return;
// }

// const hora = data.hours[0];

// const onda = hora.waveHeight.sg;
// const periodo = hora.wavePeriod.sg;
// const vento = hora.windSpeed.sg;

// console.log(`Onda: ${onda}m`);
// console.log(`Período: ${periodo}s`);
// console.log(`Vento: ${vento}km/h`);

// }

// buscarDados();

// HERO PESQUISAR E CARDS
let picos = [];

function handleSearch(){
  const input = document.getElementById("searchInput").value.trim().toLowerCase();

  if (!input) return;

  const picoEncontrado = picos.find(p =>
    p.nome.toLowerCase().includes(input)
  );

  if (!picoEncontrado){
    alert("Praia não encontrada...")
  }

  console.log("Pico selecionado", picoEncontrado);

  const section = document.getElementById("picoResult");

  section.classList.remove("hidden");

  setTimeout(() => {
    section.classList.add("active");
  }, 50);
};



// SUGGESTIONS AUTOCOMPLETE

const input = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

let timeout = null;

input.addEventListener("input", () => {
  const value = input.value.trim().toLowerCase();

  suggestionsBox.innerHTML = "";

  if (!value) return;

  clearTimeout(timeout);

  // BUSCAR NO BANCO DE DADOS 
  timeout = setTimeout(async () => {
    const sugestoesAPI = await buscarSugestoes(value);

    const sugestoesLocal = picos.filter (p => 
      p.nome.toLowerCase().includes(value.toLowerCase())
    );

    const todasSugestoes = [...sugestoesLocal, ...sugestoesAPI];

    mostrarSugestoes(todasSugestoes.slice(0 ,  6));
  },300);
  });

  // API PHOTON 

  async function buscarSugestoes(query) {
  try {
    const res = await fetch(`https://photon.komoot.io/api/?q=${query}&limit=5`);
    const data = await res.json();

    return data.features.map(f => ({
      nome: f.properties.name || "Local",
      cidade: f.properties.city || "",
      lat: f.geometry.coordinates[1],
      lng: f.geometry.coordinates[0],
      origem: "api"
    }));
  } catch (err) {
    console.error("Erro API", err);
    return [];
  }
}

function mostrarSugestoes(lista) {
  suggestionsBox.innerHTML = "";

  lista.forEach(item => {
    const div = document.createElement("div");

    div.textContent = item.cidade
    ? `${item.nome} - ${item.cidade}`
    : item.nome;

    div.onclick = () => {
      input.value = item.nome;
      suggestionsBox.innerHTML = "";

      console.log("Selecionado", item);
    };

    suggestionsBox.appendChild(div);
  })
}




//  PEGAR LOCALIZAÇÃO ATUAL AO ACESSAR 

window.addEventListener("load", () => {
  pegarLocalizacaoHero();
});

function pegarLocalizacaoHero() {
  const subtitle = document.getElementById("hero-subtitle");

  if (!navigator.geolocation) {
    subtitle.innerText = "Ative a localização para melhores sugestões";
    return;
  }

  navigator.geolocation.getCurrentPosition(async pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    subtitle.innerText = "Baseado na sua localização";

    const pico = encontrarPicoMaisProximo(lat, lng);

    if (pico) {
      mostrarSugestaoHero(pico);
    }

  }, () => {
    subtitle.innerText = "Explore os melhores picos manualmente";
  });
}


function mostrarSugestaoHero(pico) {
  const box = document.getElementById("heroSuggestion");

  box.innerHTML = `📍 Pico próximo: <strong>${pico.nome}</strong>`;

  box.onclick = () => {
    document.getElementById("searchInput").value = pico.nome;
    handleSearch();
  };
}


// ENCONTRAR PICO MAIS PROXIMO

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLon = (lon2-lon1) * Math.PI/180;

  const a = 
  Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI/180) *
  Math.cos(lat2 * Math.PI/180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2* Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function encontrarPicoMaisProximo(lat, lng){
  let maisProximo = null;
  let menorDistancia = Infinity;

  picos.forEach(p => {
    const dist = calcularDistancia(lat, lng, p.lat, p.lng);

    if(dist < menorDistancia) {
      menorDistancia = dist;
      maisProximo = p;
    }
  });

  return maisProximo; //
}




// PICOS E TRIPS SECTION


const grid = document.getElementById("picosGrid");

function renderizarPicos(lista) {
  grid.innerHTML = "";

  lista.forEach(pico => {
    const card = document.createElement("div");
    card.classList.add("pico-card");

    card.innerHTML = `
      <img src ="${pico.imagem}" alt="">
      <div class = "picos-text">
        <h3>${pico.nome}</h3>
        <p>${pico.descricao}</p>  
        <button class="preco">Ver Oferta (${pico.preco})</button>  </div>
      `;
      
      grid.appendChild(card);
      
  });
}


const inputBusca = document.getElementById("buscaPico");

inputBusca.addEventListener("input", () => {
  const valor = inputBusca.value.toLowerCase();

  const filtrados = picos.filter(pico =>
    pico.nome.toLowerCase().includes(valor)  ||
    pico.descricao.toLowerCase().includes(valor)
  );
  renderizarPicos(filtrados);
});

const SUPABASE_URL = "https://aepdskqduwtktoymidlq.supabase.co";
const SUPABASE_KEY = "sb_publishable_62IwM6Kzbp6oRGDC2WtVSw_KUPD2yOf";

async function carregarPicos() {
 const response = await fetch(`${SUPABASE_URL}/rest/v1/picos`, {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`
  }

  
 });

 

 const data = await response.json();
 
 console.log("Dados do banco", data);
 picos = data;
 renderizarPicos(data);

 
}

carregarPicos();

// Formulario de novos Posts

async function adicionarPico() {
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const precoInput = Number(document.getElementById("preco").value.trim());
  const imagem = document.getElementById("imagem").value.trim();



  // conferindo campos vazios

  if (!nome || !descricao || !precoInput || !imagem ){
    alert("Preencha todos os campos ! ");
    return;
  }  
  
  const preco = Number(precoInput);


  // validando preço 
  if (isNaN(preco) || preco  <= 0) {
      alert("Preço Inválido");
      return;
  }

  
    

  const response = await fetch (`${SUPABASE_URL}/rest/v1/picos`, {
  method: "POST",
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify ({
    nome,
    descricao,
    preco,
    imagem  
  })
});

  if (response.ok) {
    alert("Pico Adicionado com sucesso !");
    carregarPicos();

  } else{
    console.error("Erro ao Salvar")
  }
}

