import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-content">

        {/* BRAND */}
        <div className="footer-brand">

          <h2> EncicloSurf</h2>

          <p>
            Plataforma colaborativa de surf com
            previsões, trips e informações reais da comunidade.
          </p>

        </div>

        {/* LINKS */}
        <div className="footer-links">

          <div>
            <h4>Explorar</h4>

            <Link href="/">Home</Link>

            <Link href="/">Previsões</Link>

            <Link href="/">Picos</Link>

            <Link href="/">Trips</Link>
          </div>

          <div>
            <h4>Comunidade</h4>

            <Link href="/">Adicionar pico</Link>

            <Link href="/">Relatórios</Link>

            <Link href="/">Artigos</Link>
          </div>

          <div>
            <h4>Social</h4>

            <a href="/">Instagram</a>

            <a href="/">YouTube</a>

            <a href="/">TikTok</a>
          </div>

        </div>

      </div>

      <div className="footer-bottom">

        <p>
          © 2026 EncicloSurf — Todos os direitos reservados DL. DEV
        </p>

      </div>

    </footer>
  );
}