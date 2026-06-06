import { createClient } from "../lib/supabase/server";

export default async function PicoTags({ picoId }) {
  const supabase = await createClient();

  // busca as 4 tags mais votadas para este pico
  const { data: votes } = await supabase
    .from("spot_tag_votes")
    .select("tag_id, spot_tags(label, emoji, slug)")
    .eq("pico_id", picoId);

  if (!votes?.length) return null;

  // conta votos por tag
  const contagem = {};
  votes.forEach((v) => {
    const id = v.tag_id;
    if (!contagem[id]) {
      contagem[id] = {
        ...v.spot_tags,
        votos: 0,
      };
    }
    contagem[id].votos++;
  });

  // ordena por votos e pega top 4
  const top4 = Object.values(contagem)
    .sort((a, b) => b.votos - a.votos)
    .slice(0, 4);

  return (
    <div style={{ marginTop: 12, marginBottom: 4 }}>
      <p style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: 8,
      }}>
        Tags locais
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {top4.map((tag) => (
          <span
            key={tag.slug}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              background: "rgba(14,165,233,0.08)",
              border: "1px solid rgba(14,165,233,0.2)",
              color: "#94a3b8",
            }}
          >
            {tag.emoji} {tag.label}
            <span style={{
              fontSize: 10,
              color: "#475569",
              marginLeft: 2,
            }}>
              {tag.votos}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}