'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Suite Home', href: '/human-equation-suite' },
  { label: 'Dashboard', href: '/human-equation-suite/dashboard' },
  { label: 'Course', href: '/human-equation-suite/course' },
  { label: 'Diagnostic', href: '/human-equation-suite/diagnostic' },
  { label: 'Parent Call', href: '/human-equation' },
  { label: 'Urban Student Sim', href: '/day-in-the-life-urban-student' },
  { label: 'Leadership Sim', href: '/simulation-overview' },
];

export default function HumanEquationNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Human Equation navigation" className="human-equation-nav">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/human-equation-suite/course' && pathname.startsWith('/human-equation-suite/course'));
        return (
          <Link key={item.href} href={item.href} className={`button ${isActive ? 'primary' : 'secondary'}`}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
