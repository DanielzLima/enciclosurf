# 🌊 EncicloSurf

Plataforma colaborativa de surf desenvolvida para conectar comunidade, dados em tempo real e economia local em um único ecossistema.

---

# 🚀 Visão do Projeto

O EncicloSurf nasce com a proposta de criar uma experiência parecida com:

* Surfline + Waze do Surf + Comunidade Local

A ideia é permitir que surfistas compartilhem condições reais do mar em tempo real, criando inteligência coletiva sobre os picos do Brasil.

Além das condições do mar, a plataforma também será um hub de:

* turismo
* viagens
* eventos
* experiências
* hospedagens
* lifestyle
* economia local

Tudo integrado em torno de cada pico de surf.

---

# 🎯 Objetivo

Criar uma plataforma colaborativa onde usuários possam:

* visualizar condições reais do mar
* acessar informações dos picos
* acompanhar tendências das ondas
* descobrir viagens e experiências
* contribuir com reports da comunidade
* gerar dados históricos e inteligência de surf

---
# 🌊 Inteligência Colaborativa

O EncicloSurf utiliza reports da comunidade em tempo real para gerar indicadores dinâmicos das condições do mar.

Os usuários podem:

- avaliar o pico
- adicionar características da sessão
- informar condições específicas
- alimentar tendências do mar em tempo real

As informações são processadas para gerar:

- score da comunidade
- tendência do pico
- condições temporais
- tags inteligentes
- leitura coletiva do mar

---

# ⚙️ Tecnologias

## Frontend

* Next.js (App Router)
* React
* CSS Modules / Global CSS

## Backend

* Supabase
* PostgreSQL

## Arquitetura

* Componentização
* Mobile-first
* Estrutura escalável baseada em dados
* Session-based interactions (sem login inicialmente)

---
# 🧠 Arquitetura de Dados

A plataforma foi estruturada com foco em escalabilidade e evolução contínua.

Atualmente utiliza:

- Supabase
- PostgreSQL relacional
- Session-based interactions
- Services layer
- Component-driven architecture
- Dynamic routes
- Real-time oriented structure

---

# 🔥 Funcionalidades Atuais

## 🌊 Sistema de Reports

* ✅ Reports em tempo real
* ✅ Sistema anti-spam via session_id
* ✅ Limite diário de reports
* ✅ Score da comunidade
* ✅ Tendência do pico (melhorando / piorando)
* ✅ Distribuição de condições:

  * Flat
  * Boas
  * Clássico

## 📍 Página Dinâmica de Pico

* ✅ Rotas dinâmicas (`/pico/[slug]`)
* ✅ Hero responsivo
* ✅ Dashboard do pico
* ✅ Mapa integrado
* ✅ Gráfico de swell
* ✅ Tábua de maré
* ✅ Informações do pico

## 🔍 Sistema de Busca

* ✅ Busca dinâmica
* ✅ Autocomplete
* ✅ Navegação inteligente entre picos

---

# 🧠 Em Desenvolvimento

## Fase Atual — Feed AO VIVO

* 🚧 Feed de reports em tempo real
* 🚧 Comentários opcionais pós-report
* 🚧 Usuários anônimos via sessão
* 🚧 Tempo relativo ("2 min atrás")
* 🚧 Score inteligente do pico
* 🚧 Peso maior para reports recentes

## Próximas Features

* 🌊 Histórico de condições
* 📈 Gráficos avançados
* 🗺️ Heatmap de crowd
* 📸 Feed da comunidade
* ✈️ Surf trips
* 🎉 Eventos
* 🏨 Hospedagens
* 🏄 Marketplace local

---

# 📱 Filosofia Mobile-First

O EncicloSurf está sendo desenvolvido com foco em:

* performance
* simplicidade
* navegação rápida
* experiência mobile
* conteúdo acima da dobra
* consumo rápido de informação

Estrutura pensada para uso real na praia e durante sessões.

---

# 🧱 Estrutura Atual do Projeto

```bash
app/
 ├── pico/[slug]/page.js
 ├── components/
 ├── services/
 ├── utils/

components/
 ├── Header.jsx
 ├── Hero.jsx
 ├── ReportButtons.jsx
 ├── CommunityFeed.jsx
 ├── ForecastChart.jsx
 ├── Map.jsx

services/
 ├── supabase/
```

# ▶️ Como Rodar o Projeto

```bash
npm install
npm run dev
```

Aplicação disponível em:

```bash
http://localhost:3000
```

---

# 💡 Visão de Longo Prazo

Transformar o EncicloSurf em uma plataforma colaborativa capaz de:

* gerar inteligência coletiva sobre o mar
* fomentar turismo regional
* fortalecer comunidades locais
* conectar surfistas e negócios
* criar o maior banco colaborativo de condições de surf do Brasil

---

# 👨‍💻 Desenvolvido por

Daniel Lima

Desenvolvedor Frontend em evolução construindo projetos reais focados em produto, comunidade e experiência do usuário.
