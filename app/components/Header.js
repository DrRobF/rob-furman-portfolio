import Link from 'next/link';

const navItems = [
  ['Services', '/#services'],
  ['Gallery', '/#gallery'],
  ['About', '/#about'],
  ['Journal', '/#journal'],
  ['Contact', '/#contact'],
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          Maison Lucia
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-list">
            {navItems.map(([label, href]) => (
              <li key={href}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href="/#contact" className="header-inquire">
          Inquire
        </Link>
      </div>
    </header>
  );
}
