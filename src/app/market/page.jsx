export const metadata = {
  title: "EncicloMarket | Enciclosurf",
  description: "O marketplace do surf brasileiro. Em breve.",
};

const PREVIEW = [
  { emoji: "🏄", label: "Pranchas e equipamentos" },
  { emoji: "✈️", label: "Surf trips e pacotes" },
  { emoji: "🏠", label: "Hospedagens em picos" },
  { emoji: "🎓", label: "Aulas e cursos" },
  { emoji: "📸", label: "Ensaios fotográficos" },
  { emoji: "🛒", label: "Vouchers de parceiros" },
];

export default function MarketPage() {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1.25rem 5rem", textAlign: "center" }}>

      <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>

      <h1 style={{
        fontSize: "clamp(1.8rem, 6vw, 2.4rem)",
        fontWeight: 700, letterSpacing: "-1px", marginBottom: 10,
      }}>
        EncicloMarket
      </h1>

      <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7, marginBottom: "2.5rem" }}>
        O marketplace do surf brasileiro está chegando.
        Equipamentos, hospedagens, surf trips e muito mais —
        tudo conectado aos picos e à comunidade Enciclosurf.
      </p>

      {/* BADGE EM BREVE */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "8px 18px", borderRadius: 999,
        background: "rgba(245,158,11,0.1)",
        border: "1px solid rgba(245,158,11,0.25)",
        color: "#f59e0b", fontSize: 13, fontWeight: 600,
        marginBottom: "2.5rem",
      }}>
        🚧 Em construção
      </div>

      {/* PREVIEW DO QUE VEM */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 14,
        }}>
          O que vem por aí
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {PREVIEW.map((item) => (
            <div key={item.label} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12, padding: "14px",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <p style={{ fontSize: 12, color: "rgba(248,250,252,0.7)", textAlign: "left" }}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ENCICLOPOINTS */}
      <div style={{
        background: "rgba(14,165,233,0.06)",
        border: "1px solid rgba(14,165,233,0.15)",
        borderRadius: 16, padding: "20px",
        marginBottom: "2.5rem",
      }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 8 }}>
          🏄 Seus pontos valem aqui
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Os Pontos de Contribuição que você acumula na plataforma poderão ser
          trocados por descontos, vouchers e experiências no EncicloMarket.
          Quem contribui mais, ganha mais.
        </p>
      </div>

      {/* CTA */}
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
        Quer ser um dos primeiros vendedores?
      </p>
      <a
        href="https://wa.me/55819XXXXXXXX"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "12px 24px", borderRadius: 999, fontSize: 14, fontWeight: 600,
          background: "rgba(14,165,233,0.12)",
          border: "1px solid rgba(14,165,233,0.25)",
          color: "var(--primary)", textDecoration: "none",
        }}
      >
        💬 Entre em contato
      </a>

    </div>
  );
}