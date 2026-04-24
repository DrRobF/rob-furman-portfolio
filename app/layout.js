import './globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export const metadata = {
  title: 'Dr. Rob Furman | AI + Learning Design Portfolio',
  description:
    'Portfolio of Dr. Rob Furman focused on AI learning systems, simulation design, educational leadership, speaking, and publications.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
