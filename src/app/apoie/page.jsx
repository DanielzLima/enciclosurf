"use client";

import { useEffect, useState } from "react";

const MOTIVOS = [
  { emoji: "🌊", texto: "Mapear todos os picos de surf do Brasil" },
  { emoji: "📍", texto: "Dar visibilidade a picos escondidos" },
  { emoji: "🤙", texto: "Fortalecer a economia local do surf" },
  { emoji: "📊", texto: "Criar o maior banco de dados colaborativo do surf" },
  { emoji: "🏄", texto: "Conectar surfistas de norte a sul do Brasil" },
];

const IMPACTOS = [
  { valor: "5",  label: "café pra quem desenvolve", emoji: "☕" },
  { valor: "15", label: "1 mês de servidor",         emoji: "⚡" },
  { valor: "30", label: "APIs de dados do mar",       emoji: "🌊" },
  { valor: "50", label: "evolução da plataforma",     emoji: "🚀" },
];

function useContador(alvo, duracao = 1500) {
  const [valor, setValor] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = alvo / (duracao / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= alvo) { setValor(alvo); clearInterval(timer); }
      else setValor(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [alvo, duracao]);
  return valor;
}

export default function ApoiePage() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisivel(true), 100);
  }, []);

  const picos = useContador(visivel ? 5 : 0, 1200);
  const usuarios = useContador(visivel ? 12 : 0, 1000);
  const reports = useContador(visivel ? 48 : 0, 1400);

  return (
    <div style={{
      maxWidth: 560,
      margin: "0 auto",
      padding: "2rem 1.25rem 5rem",
      opacity: visivel ? 1 : 0,
      transform: visivel ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>

      {/* HERO */}
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🌊</div>
        <h1 style={{
          fontSize: "clamp(1.6rem, 6vw, 2.2rem)",
          fontWeight: 700,
          letterSpacing: "-1px",
          marginBottom: 12,
          lineHeight: 1.2,
        }}>
          O surf brasileiro merece<br />
          <span style={{ color: "var(--primary)" }}>um lugar só seu.</span>
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
          A Enciclosurf é um projeto independente, construído por surfista,
          para surfistas. Para, Com e Pelo Surf !!!
        </p>
      </div>

      {/* NÚMEROS ANIMADOS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        marginBottom: "2rem",
      }}>
        {[
          { valor: picos,    label: "picos mapeados", emoji: "📍" },
          { valor: usuarios, label: "surfistas",       emoji: "🏄" },
          { valor: reports,  label: "reports feitos",  emoji: "🌊" },
        ].map((item) => (
          <div key={item.label} style={{
            background: "rgba(14,165,233,0.06)",
            border: "1px solid rgba(14,165,233,0.15)",
            borderRadius: 14,
            padding: "16px 8px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: 10, marginBottom: 6 }}>{item.emoji}</p>
            <p style={{
              fontSize: 28, fontWeight: 700,
              color: "var(--primary)", lineHeight: 1,
              letterSpacing: "-1px",
            }}>
              {item.valor}+
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{item.label}</p>
          </div>
        ))}
      </div>

      {/* O QUE ESTAMOS CONSTRUINDO */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "20px",
        marginBottom: "2rem",
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
          Para onde vamos
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {MOTIVOS.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                opacity: visivel ? 1 : 0,
                transform: visivel ? "translateX(0)" : "translateX(-16px)",
                transition: `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{m.emoji}</span>
              <p style={{ fontSize: 13, color: "rgba(248,250,252,0.8)", lineHeight: 1.4 }}>{m.texto}</p>
            </div>
          ))}
        </div>
      </div>

      {/* COMO APOIAR */}
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14 }}>
          Escolha como apoiar
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {IMPACTOS.map((item) => (
            <div key={item.valor} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 12,
              padding: "14px",
              cursor: "pointer",
              transition: "border-color 0.2s, background 0.2s",
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(14,165,233,0.4)";
                e.currentTarget.style.background = "rgba(14,165,233,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              <p style={{ fontSize: 20, marginBottom: 6 }}>{item.emoji}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: "var(--primary)", letterSpacing: "-0.5px" }}>
                R${item.valor}
              </p>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, lineHeight: 1.4 }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BOTÕES DE DOAÇÃO */}
      <div>
      <a
            href="https://picpay.me/enciclosurf"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "14px",
                background: "linear-gradient(135deg, #21c25e, #1aab52)",
                borderRadius: 12,
                textDecoration: "none",
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                transition: "transform 0.15s, opacity 0.15s",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
            }}
            >
            💚 Apoiar via PicPay
            </a>

        
            <a
                href="https://vakinha.com.br/enciclosurf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    padding: "14px",
                    background: "rgba(14,165,233,0.1)",
                    border: "1px solid rgba(14,165,233,0.3)",
                    borderRadius: 12,
                    textDecoration: "none",
                    color: "var(--primary)",
                    fontSize: 14,
                    fontWeight: 600,
                }}
                >
                🌊 Apoiar via Vakinha
                </a>

        <button
          onClick={() => {
            navigator.clipboard.writeText("81991205968"); 
            alert("Chave PIX copiada! 🤙");
          }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            color: "var(--muted)", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
            transition: "transform 0.15s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
        >
          📋 Copiar chave PIX
        </button>
      </div>

      {/* QR CODE PLACEHOLDER */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        padding: "20px",
        textAlign: "center",
        marginBottom: "2rem",
      }}>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
          QR Code PIX
        </p>
        {/* substitua pela sua imagem de QR Code */}
        <div style={{
          width: 140, height: 140,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: "#475569",
        }}>
         <img src="qrcode.jpg" alt="" />
        </div>
        <p style={{ fontSize: 11, color: "#475569", marginTop: 12 }}>
          Aponte a câmera para doar via PIX
        </p>
      </div>

      {/* MENSAGEM FINAL */}
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
          Cada apoio, por menor que seja, mantém a Enciclosurf no ar
          e acelera o mapeamento dos picos do Brasil.
        </p>
        <p style={{ fontSize: 20, marginTop: 12 }}>🤙</p>
      </div>

    </div>
  );
}