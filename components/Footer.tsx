export function Footer() {
  const year   = new Date().getFullYear();
  const author = process.env.NEXT_PUBLIC_AUTHOR ?? "dev";

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-left">
          <span className="footer-dot">●</span>
          <span>
            Narayana
          </span>
        </div>

        <div className="footer-right">
          <a href="https://github.com/venkatanarayanareddyp2pai-ops" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
