import './globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SiteAnalytics } from './components/SiteAnalytics';
import { LanguageProvider } from './components/LanguageProvider';

export const metadata = {
  metadataBase: new URL('https://www.drrobfurman.com'),
  title: 'Dr. Rob Furman | Education Keynote Speaker & Human-Centered AI Leader',
  description:
    'Keynotes and practical leadership guidance from Dr. Rob Furman on school leadership under pressure, The Human Test, and AI that strengthens educators and learners.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </LanguageProvider>
        <SiteAnalytics />
      </body>
    </html>
  );
}
