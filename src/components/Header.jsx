"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/AuthModal";
import { createPortal } from "react-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fetchProfile = useCallback(async (userId) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();
    return data?.avatar_url ?? null;
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        const av = await fetchProfile(u.id);
        setAvatarUrl(av ?? u.user_metadata?.avatar_url ?? null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) {
        setTimeout(async () => {
          const av = await fetchProfile(u.id);
          setAvatarUrl(av ?? u.user_metadata?.avatar_url ?? null);
        }, 500);
        const intencao = sessionStorage.getItem("pos_login");
        if (intencao === "add_spot") {
          sessionStorage.removeItem("pos_login");
          setTimeout(() => window.dispatchEvent(new CustomEvent("open-add-spot-modal")), 800);
        }
      } else {
        setAvatarUrl(null);
      }
    });

    function handleOpenAuth() { setAuthOpen(true); }
    window.addEventListener("open-auth-modal", handleOpenAuth);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-auth-modal", handleOpenAuth);
    };
  }, [fetchProfile]);

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setAvatarUrl(null);
      setMenuOpen(false);
      window.location.href = "/";
    }
  }

  const AvatarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );

  const avatarContent = avatarUrl ? (
    <img src={avatarUrl} alt="Perfil" />
  ) : user ? (
    <span>{user.email?.[0].toUpperCase()}</span>
  ) : null;

  return (
    <header className="header">
      <div className="content-header">

        <Link href="/" className="logo">
          <img src="/Enciclosurf-logo.jpg" alt="Enciclosurf" />
          <span>EncicloSurf</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="nav">
          <Link href="/blog">Blog</Link>
          <Link href="/apoie" style={{ color: "var(--primary)", fontWeight: 600 }}>Apoie</Link>
          <Link href="/parceiros">Parceiros</Link>
          <Link href="/market">
            EncicloMarket
            <span style={{
              marginLeft: 6, fontSize: 9, padding: "1px 6px",
              borderRadius: 999, background: "rgba(14,165,233,0.15)",
              border: "1px solid rgba(14,165,233,0.3)",
              color: "var(--primary)", fontWeight: 700,
              verticalAlign: "middle",
            }}>
              EM BREVE
            </span>
          </Link>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="actions">
          {user ? (
            <>
              <Link href="/perfil" className="header-avatar">{avatarContent}</Link>
              <button className="buttonLogin" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <button className="buttonLogin" onClick={() => setAuthOpen(true)}>Entrar</button>
          )}
        </div>

        {/* MOBILE */}
        <div className="header-mobile-right">
          {user ? (
            <Link href="/perfil" className="header-avatar">{avatarContent}</Link>
          ) : (
            <button className="header-avatar header-avatar-guest" onClick={() => setAuthOpen(true)} aria-label="Entrar">
              <AvatarIcon />
            </button>
          )}
          <button className="menu-mobile" onClick={() => setMenuOpen(true)}>☰</button>
        </div>

      </div>

      {authOpen && typeof window !== "undefined" && createPortal(
        <AuthModal onClose={() => setAuthOpen(false)} />,
        document.body
      )}

      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}

      <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>✕</button>

        <nav className="mobile-nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="/apoie" onClick={() => setMenuOpen(false)} style={{ color: "var(--primary)" }}>
            🤙 Apoie a Enciclosurf
          </Link>
          <Link href="/parceiros" onClick={() => setMenuOpen(false)}>Parceiros</Link>
          <Link href="/market" onClick={() => setMenuOpen(false)}>
            EncicloMarket <span style={{ fontSize: 10, color: "var(--muted)" }}>em breve</span>
          </Link>
        </nav>

        <div className="mobile-actions">
          {user ? (
            <button className="buttonLogin" onClick={handleLogout}>Sair</button>
          ) : (
            <button className="buttonLogin" onClick={() => { setMenuOpen(false); setAuthOpen(true); }}>
              Entrar
            </button>
          )}
        </div>
      </aside>
    </header>
  );
}