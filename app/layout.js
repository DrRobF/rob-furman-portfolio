import './globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Script from 'next/script';
export const metadata = {
  title: 'Maison Lucia | Luxury Event Styling',
  description:
    'Maison Lucia creates refined tablescapes and elevated event styling for celebrations, milestones, intimate gatherings, and unforgettable events.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
        <Script id="clarity-script" strategy="afterInteractive">
          {`
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "wiauxlc5d5");
`}
        </Script>
      </body>
    </html>
  );
}
