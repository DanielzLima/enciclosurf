import Link from "next/link";

const CATEGORIAS = [
  { slug: "noticias",     label: "Notícias",       emoji: "📰" },
  { slug: "previsao",     label: "Previsão",        emoji: "🌊" },
  { slug: "equipamentos", label: "Equipamentos",    emoji: "🏄" },
  { slug: "viagens",      label: "Viagens",         emoji: "✈️" },
  { slug: "cultura",      label: "Cultura Surf",    emoji: "🎨" },
  { slug: "aprendizado",  label: "Aprendizado",     emoji: "🎓" },
  { slug: "campeonatos",  label: "Campeonatos",     emoji: "🏆" },
  { slug: "guia-picos",   label: "Guia de Picos",   emoji: "📍" },
];

export const metadata = {
  title: "Blog | Enciclosurf",
  description: "Notícias, guias e conteúdo sobre surf no Brasil.",
};

export default function BlogPage() {
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
          Blog
        </h1>
        <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>
          Notícias, guias, viagens e tudo sobre a cultura surf no Brasil.
          Conteúdo feito pela e para a comunidade.
        </p>
      </div>

      {/* BANNER EM DESENVOLVIMENTO */}
      <div style={{
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.25)",
        borderRadius: 16,
        padding: "24px 20px",
        marginBottom: "2.5rem",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 28, marginBottom: 8 }}>🚧</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>
          Página em desenvolvimento
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          O blog da Enciclosurf está sendo construído.
          Em breve: notícias, guias de picos, previsões semanais e muito conteúdo da comunidade.
        </p>
      </div>

      {/* CATEGORIAS — estrutura visual */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--muted)", marginBottom: 14,
        }}>
          Categorias
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATEGORIAS.map((cat) => (
            <div key={cat.slug} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 999, fontSize: 13,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--muted)",
            }}>
              {cat.emoji} {cat.label}
            </div>
          ))}
        </div>
      </div>

      {/* BLOCOS DE CONTEÚDO — placeholders */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Destaque principal */}
        <div style={{
          background: "rgba(14,165,233,0.05)",
          border: "1px solid rgba(14,165,233,0.12)",
          borderRadius: 16, padding: "20px",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
            textTransform: "uppercase", color: "var(--primary)",
          }}>
            Destaque
          </p>
          <div style={{
            height: 180, borderRadius: 12,
            background: "rgba(255,255,255,0.04)",
            border: "1px dashed rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#334155", fontSize: 13,
          }}>
            Imagem do post em destaque
          </div>
          <div style={{
            height: 20, borderRadius: 6,
            background: "rgba(255,255,255,0.05)", width: "60%",
          }} />
          <div style={{
            height: 14, borderRadius: 6,
            background: "rgba(255,255,255,0.03)", width: "85%",
          }} />
          <div style={{
            height: 14, borderRadius: 6,
            background: "rgba(255,255,255,0.03)", width: "70%",
          }} />
        </div>

        {/* Grid de posts recentes */}
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
          textTransform: "uppercase", color: "var(--muted)", marginTop: 8,
        }}>
          Mais recentes
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "16px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{
                height: 120, borderRadius: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px dashed rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#334155", fontSize: 12,
              }}>
                Imagem
              </div>
              <div style={{ height: 16, borderRadius: 4, background: "rgba(255,255,255,0.06)", width: "75%" }} />
              <div style={{ height: 12, borderRadius: 4, background: "rgba(255,255,255,0.04)", width: "90%" }} />
              <div style={{ height: 12, borderRadius: 4, background: "rgba(255,255,255,0.04)", width: "60%" }} />
              <div style={{
                display: "flex", gap: 8, marginTop: 4,
                fontSize: 11, color: "#334155",
              }}>
                <span>🤙 0</span>
                <span>👁 0 views</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA comunidade */}
      <div style={{
        marginTop: "3rem",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16, padding: "24px 20px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: 18, marginBottom: 8 }}>✍️</p>
        <p style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 6 }}>
          Quer contribuir com conteúdo?
        </p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, lineHeight: 1.6 }}>
          Se você é fotógrafo, surfista ou conhece bem um pico do Brasil,
          entre em contato. Queremos conteúdo real, feito por quem vive o surf.
        </p>
        <a
          href="https://wa.me/5581991627296"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 20px", borderRadius: 999, fontSize: 13, fontWeight: 600,
            background: "rgba(14,165,233,0.12)",
            border: "1px solid rgba(14,165,233,0.25)",
            color: "var(--primary)", textDecoration: "none",
          }}
        >
          💬 Falar com a equipe
          
        </a>
      </div>

    </div>
  );
}