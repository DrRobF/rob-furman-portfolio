'use client';

import Link from 'next/link';
import { useLanguage } from './LanguageProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

const navItems = [
  ['nav.home', '/'],
  ['nav.projects', '/projects'],
  ['nav.speaking', '/speaking'],
  ['nav.publications', '/publications'],
  ['nav.about', '/about'],
  ['nav.contact', '/contact'],
];

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          Dr. Rob Furman
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-list">
            {navItems.map(([key, href]) => (
              <li key={href}>
                <Link href={href}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
