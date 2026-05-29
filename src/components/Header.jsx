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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          // pequeno delay para garantir que a sessão está ativa antes da query
          setTimeout(async () => {
            const av = await fetchProfile(u.id);
            setAvatarUrl(av ?? u.user_metadata?.avatar_url ?? null);
          }, 500);
        } else {
          setAvatarUrl(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  async function handleLogout() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setAvatarUrl(null);
      setMenuOpen(false);
      window.location.href = "/"; // força reload completo para limpar estado
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
          <span>Enciclosurf</span>
        </Link>

        <nav className="nav">
          <Link href="#">Previsão</Link>
          <Link href="#">Blog</Link>
          <Link href="#">Picos</Link>
          <Link href="#">Social</Link>
        </nav>

        {/* DESKTOP */}
        <div className="actions">
          {user ? (
            <>
              <Link href="/perfil" className="header-avatar">
                {avatarContent}
              </Link>
              <button className="buttonLogin" onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <button className="buttonLogin" onClick={() => setAuthOpen(true)}>
              Entrar
            </button>
          )}
        </div>

        {/* MOBILE — avatar/pessoa + hamburguer */}
        <div className="header-mobile-right">
          {user ? (
            <Link href="/perfil" className="header-avatar">
              {avatarContent}
            </Link>
          ) : (
            <button
              className="header-avatar header-avatar-guest"
              onClick={() => setAuthOpen(true)}
              aria-label="Entrar"
            >
              <AvatarIcon />
            </button>
          )}
          <button className="menu-mobile" onClick={() => setMenuOpen(true)}>☰</button>
        </div>

      </div>

      {/* MODAL DE LOGIN */}
      {authOpen && typeof window !== "undefined" && createPortal(
        <AuthModal onClose={() => setAuthOpen(false)} />,
        document.body
      )}

      {menuOpen && (
        <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>✕</button>

        <nav className="mobile-nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Previsão</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Blog</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Picos</Link>
          <Link href="#" onClick={() => setMenuOpen(false)}>Social</Link>
        </nav>

        <div className="mobile-actions">
          {user ? (
            <button className="buttonLogin" onClick={handleLogout}>
              Sair
            </button>
          ) : (
            <button
              className="buttonLogin"
              onClick={() => { setMenuOpen(false); setAuthOpen(true); }}
            >
              Entrar
            </button>
          )}
        </div>
      </aside>
    </header>
  );
}