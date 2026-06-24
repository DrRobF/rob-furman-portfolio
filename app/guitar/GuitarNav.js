import Link from 'next/link';
import { guitarSections } from './guitarData';

export function GuitarNav({ currentHref = '/guitar' }) {
  return (
    <nav className="guitar-nav" aria-label="Fretboard Freedom sections">
      <Link className={currentHref === '/guitar' ? 'active' : ''} href="/guitar">
        Home
      </Link>
      {guitarSections.map((section) => (
        <Link
          className={currentHref === section.href ? 'active' : ''}
          href={section.href}
          key={section.href}
        >
          {section.title}
        </Link>
      ))}
    </nav>
  );
}
