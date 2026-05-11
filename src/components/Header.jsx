import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="content-header">

        {/* LOGO */}
        <Link href="/" className="logo">
          <img src="/Enciclosurf-logo.jpg" alt="Enciclosurf" />
          <span>Enciclosurf</span>
        </Link>

        {/* MENU */}
        <nav className="nav">
          <Link href="#">Previsão</Link>
          <Link href="#">Blog</Link>
          <Link href="#">Picos</Link>
          <Link href="#">Social</Link>
        </nav>

        {/* AÇÕES */}
        <div className="actions">
          <a href="#" className="cadastro">Cadastre-se</a>
          <button className="buttonLogin">Login</button>
        </div>

      </div>
    </header>
  );
}