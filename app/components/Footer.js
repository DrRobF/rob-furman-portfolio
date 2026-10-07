import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <p>© {new Date().getFullYear()} Dr. Rob Furman. All rights reserved. · <Link href="/privacy-policy">Privacy</Link></p>
        <p>Vero Beach, FL · Rob@FurmanR.com</p>
      </div>
    </footer>
  );
}
