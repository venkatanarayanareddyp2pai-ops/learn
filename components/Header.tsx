import Link from "next/link";

export function Header() {
  const name = process.env.NEXT_PUBLIC_SITE_NAME ?? "Narayana's BLOG";

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-logo">
          {name}
          <span className="logo-cursor" aria-hidden="true" />
        </Link>

        <nav aria-label="Main navigation">
          <ul className="nav-links">
            <li><Link href="/">posts</Link></li>
            <li><Link href="/about">about</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
