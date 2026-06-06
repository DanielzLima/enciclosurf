import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = ["dvfldev22@gmail.com"];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    redirect("/");
  }

  const [
    { data: spotRequests },
    { data: picos },
    { data: usuarios },
    { data: reports },
  ] = await Promise.all([
    supabase.from("spot_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("picos").select("id, nome, slug, is_active, cidade, uf").order("nome"),
    supabase.from("profiles").select("id, username, display_name, contribution_points, created_at").order("created_at", { ascending: false }),
    supabase.from("reports").select("id, rating, created_at").gte("created_at", new Date(Date.now() - 86400000).toISOString()),
  ]);

  const pendentes = spotRequests?.filter((s) => !s.approved) || [];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🛠️ Painel Admin</h1>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 32 }}>
        Enciclosurf — área restrita
      </p>

      {/* MÉTRICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
        {[
          { label: "Picos ativos",  value: picos?.filter(p => p.is_active).length ?? 0, color: "#0ea5e9" },
          { label: "Sugestões",     value: pendentes.length,                              color: "#f59e0b" },
          { label: "Usuários",      value: usuarios?.length ?? 0,                         color: "#8b5cf6" },
          { label: "Reports hoje",  value: reports?.length ?? 0,                          color: "#22c55e" },
        ].map((m) => (
          <div key={m.label} style={{
            background: "var(--card)", border: "1px solid var(--border)",
            borderRadius: 12, padding: "14px 16px",
          }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: m.color }}>{m.value}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{m.label}</p>
          </div>
        ))}
      </div>

      {/* SUGESTÕES PENDENTES */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          📍 Sugestões pendentes ({pendentes.length})
        </h2>
        {pendentes.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Nenhuma sugestão pendente.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {pendentes.map((s) => (
              <div key={s.id} style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "12px 16px",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: 8,
              }}>
                <div>
                  <p style={{ fontWeight: 600, color: "white", fontSize: 14 }}>{s.nome}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>
                    {s.cidade} · {s.uf} · {s.votes} apoios · {new Date(s.created_at).toLocaleDateString("pt-BR")}
                  </p>
                  {s.descricao && (
                    <p style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{s.descricao}</p>
                  )}
                </div>
               <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <a
                        href={`https://www.google.com/maps?q=${s.lat},${s.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                        fontSize: 12,
                        padding: "5px 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid var(--border)",
                        color: "var(--muted)",
                        textDecoration: "none",
                        }}
                    >
                        📍 Ver no mapa
                    </a>

                    <form action="/api/admin/aprovar-pico" method="POST">
                        <input type="hidden" name="id" value={s.id} />

                        <button
                        type="submit"
                        style={{
                            fontSize: 12,
                            padding: "5px 12px",
                            borderRadius: 8,
                            background: "rgba(14,165,233,0.15)",
                            border: "1px solid rgba(14,165,233,0.3)",
                            color: "#38bdf8",
                            cursor: "pointer",
                        }}
                        >
                        ✓ Aprovar
                        </button>
                    </form>
                    </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* USUÁRIOS RECENTES */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          👤 Usuários recentes
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(usuarios || []).slice(0, 10).map((u) => (
            <div key={u.id} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "10px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <p style={{ fontSize: 13, color: "white", fontWeight: 500 }}>
                  {u.display_name}{" "}
                  <span style={{ color: "var(--muted)" }}>@{u.username}</span>
                </p>
                <p style={{ fontSize: 11, color: "#475569" }}>
                  {new Date(u.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <span style={{ fontSize: 13, color: "#38bdf8", fontWeight: 700 }}>
                {u.contribution_points ?? 0} pts
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PICOS ATIVOS */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          🌊 Picos ativos ({picos?.filter(p => p.is_active).length ?? 0})
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {(picos || []).filter(p => p.is_active).map((p) => (
            <div key={p.id} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 10, padding: "10px 14px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <p style={{ fontSize: 13, color: "white" }}>
                {p.nome}{" "}
                <span style={{ color: "var(--muted)", fontSize: 11 }}>
                  {p.cidade}, {p.uf?.toUpperCase()}
                </span>
              </p>
              <a href={`/pico/${p.slug}`} style={{ fontSize: 11, color: "#38bdf8" }}>
                ver →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}