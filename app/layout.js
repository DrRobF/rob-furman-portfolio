import './globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SiteAnalytics } from './components/SiteAnalytics';
import { LanguageProvider } from './components/LanguageProvider';

export const metadata = {
  metadataBase: new URL('https://www.drrobfurman.com'),
  title: 'Dr. Rob Furman | School Leadership Speaker, Principal & Human-Centered AI',
  description:
    'Principal, author, and TEDx speaker Dr. Rob Furman helps educators lead under pressure and use AI that strengthens teachers. Free tools: VIC, H.E.L.P., and school simulations.',
  openGraph: {
    siteName: 'Dr. Rob Furman',
    type: 'website',
    images: [{ url: '/images/og/home.png', width: 1200, height: 630, alt: 'Dr. Rob Furman' }],
  },
  twitter: { card: 'summary_large_image', images: ['/images/og/home.png'] },
};

// Tells Google who Dr. Rob Furman is, so his name searches show a clear profile.
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dr. Rob Furman',
  alternateName: 'Dr. L. Robert Furman',
  url: 'https://www.drrobfurman.com/',
  image: 'https://www.drrobfurman.com/images/headshot-gray.jpg',
  jobTitle: 'Principal',
  worksFor: { '@type': 'EducationalOrganization', name: "Saint Peter's Academy" },
  description:
    'Principal, author, TEDx speaker, and builder of human-centered AI tools for educators, including VIC and H.E.L.P.',
  knowsAbout: ['School leadership', 'Artificial intelligence in education', 'Instructional leadership', 'Literacy', 'Educational technology'],
  address: { '@type': 'PostalAddress', addressLocality: 'Vero Beach', addressRegion: 'FL', addressCountry: 'US' },
  sameAs: ['https://www.askvic.ai/'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
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
