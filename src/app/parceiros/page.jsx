export const metadata = {
  title: "Parceiros | Enciclosurf",
  description: "Seja um parceiro da Enciclosurf e conecte seu negócio à comunidade surf do Brasil.",
};

const BENEFICIOS = [
  { emoji: "📍", titulo: "Visibilidade nos picos",     desc: "Seu negócio aparece nas páginas dos picos da sua região, onde surfistas buscam informações." },
  { emoji: "🤙", titulo: "Comunidade qualificada",     desc: "Conecte-se diretamente com surfistas ativos que consomem e recomendam produtos e serviços." },
  { emoji: "🏄", titulo: "Presença no mapa",           desc: "Escolas, lojas e pousadas ganham destaque no mapa de picos com avaliações reais da comunidade." },
  { emoji: "🌊", titulo: "Conteúdo patrocinado",       desc: "Publique conteúdo no blog da Enciclosurf e alcance surfistas de norte a sul do Brasil." },
  { emoji: "⭐", titulo: "EncicloMarket",              desc: "Em breve: ofereça vouchers, pacotes e experiências diretamente para usuários da plataforma." },
];

const PERFIS = [
  { emoji: "🏄", label: "Escolas de surf" },
  { emoji: "🔧", label: "Shapers" },
  { emoji: "📸", label: "Fotógrafos" },
  { emoji: "🏠", label: "Pousadas e hospedagens" },
  { emoji: "🏪", label: "Lojas de surf" },
  { emoji: "✈️", label: "Agências de surf trip" },
  { emoji: "⛱️", label: "Barracas e comércios locais" },
  { emoji: "🎓", label: "Instrutores" },
];

export default function ParceirosPage() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.25rem 5rem" }}>

      {/* HEADER */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 8,
        }}>
          Enciclosurf
        </p>
        <h1 style={{
          fontSize: "clamp(1.8rem, 6vw, 2.4rem)",
          fontWeight: 700, letterSpacing: "-1px", marginBottom: 10,
        }}>
          Seja um Parceiro
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
          Conecte seu negócio à maior plataforma colaborativa de surf do Brasil.
          Alcance surfistas ativos na hora que mais importa — quando estão planejando a sessão.
        </p>
      </div>

      {/* BANNER EM DESENVOLVIMENTO */}
      <div style={{
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.25)",
        borderRadius: 16, padding: "24px 20px",
        marginBottom: "2.5rem", textAlign: "center",
      }}>
        <p style={{ fontSize: 28, marginBottom: 8 }}>🚧</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
          Página em desenvolvimento
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          Estamos estruturando o programa de parceiros.
          Quer ser um dos primeiros? Entre em contato agora.
        </p>
      </div>

      {/* QUEM PODE SER PARCEIRO */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 14,
        }}>
          Quem pode ser parceiro
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PERFIS.map((p) => (
            <div key={p.label} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 999, fontSize: 13,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(248,250,252,0.8)",
            }}>
              {p.emoji} {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* BENEFÍCIOS */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 14,
        }}>
          O que você ganha
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {BENEFICIOS.map((b, i) => (
            <div key={i} style={{
              display: "flex", gap: 14,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "16px",
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>{b.emoji}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 4 }}>
                  {b.titulo}
                </p>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(56,189,248,0.05))",
        border: "1px solid rgba(14,165,233,0.2)",
        borderRadius: 16, padding: "28px 20px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 22, marginBottom: 10 }}>🤙</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "white", marginBottom: 8, letterSpacing: "-0.5px" }}>
          Quer ser um dos primeiros parceiros?
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, lineHeight: 1.6 }}>
          Estamos selecionando parceiros fundadores que acreditam na comunidade surf.
          Entre em contato e construa junto com a gente.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 320, margin: "0 auto" }}>
          <a
            href="https://wa.me/55819XXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 600,
              background: "var(--primary)", color: "white", textDecoration: "none",
              transition: "opacity 0.15s",
            }}
          >
            💬 Falar via WhatsApp
          </a>
          <a
            href="mailto:contato@enciclosurf.com.br"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 600,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--muted)", textDecoration: "none",
            }}
          >
            ✉️ contato@enciclosurf.com.br
          </a>
        </div>
      </div>

    </div>
  );
}