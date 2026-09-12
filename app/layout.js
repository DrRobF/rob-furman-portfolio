import './globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Script from 'next/script';
import { LanguageProvider } from './components/LanguageProvider';

export const metadata = {
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
