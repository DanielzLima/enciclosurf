"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {

  const [menuOpen, setMenuOpen] = useState(false);

  return (

    <header className="header">

      <div className="content-header">

        {/* LOGO */}
        <Link href="/" className="logo">

          <img
            src="/Enciclosurf-logo.jpg"
            alt="Enciclosurf"
          />

          <span>Enciclosurf</span>

        </Link>

        {/* MENU DESKTOP */}
        <nav className="nav">

          <Link href="#">Previsão</Link>

          <Link href="#">Blog</Link>

          <Link href="#">Picos</Link>

          <Link href="#">Social</Link>

        </nav>

        {/* ACTIONS */}
        <div className="actions">

          <a href="#" className="cadastro">
            Cadastre-se
          </a>

          <button className="buttonLogin">
            Login
          </button>

        </div>

        {/* MOBILE BUTTON */}
        <button
          className="menu-mobile"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

      </div>

      {/* OVERLAY */}
      {menuOpen && (

        <div
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
        />

      )}

      {/* DRAWER */}
      <aside className={`mobile-drawer ${menuOpen ? "open" : ""}`}>

        <button
          className="close-menu"
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        <nav className="mobile-nav">

          <Link href="/">Home</Link>

          <Link href="#">Previsão</Link>

          <Link href="#">Blog</Link>

          <Link href="#">Picos</Link>

          <Link href="#">Social</Link>

        </nav>

        <div className="mobile-actions">

          <button className="buttonLogin">
            Login
          </button>

        </div>

      </aside>

    </header>
  );
}