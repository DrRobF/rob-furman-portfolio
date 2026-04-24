import Link from 'next/link';

const navItems = [
  ['Home', '/'],
  ['Projects', '/projects'],
  ['Simulations', '/simulations'],
  ['School Leader Simulation', '/simulation'],
  ['VIC', '/vic'],
  ['Speaking', '/speaking'],
  ['Publications', '/publications'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

export function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          Dr. Rob Furman
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
      </div>
    </header>
  );
}
