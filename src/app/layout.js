import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsappButtonConditional from '@/components/WhatsappButtonConditional';
import { Montserrat, Open_Sans, DM_Sans, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700', '800'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['400', '600', '700'],
});

export const metadata = {
  title: 'COOFLOTAX | Cooperativa de Transportadores - Duitama, Boyacá',
  description: 'Cooperativa de Transportadores Flotax Duitama. Servicio de transporte intermunicipal e interurbano en Boyacá desde 1964. Servimos con Calidez.',
  keywords: 'transporte, Duitama, Boyacá, Cooflotax, intermunicipal, buses, taxis, cooperativa',
  icons: {
    icon: '/logo.webp',
    shortcut: '/logo.webp',
    apple: '/logo.webp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo.webp" type="image/webp" />
        <meta name="theme-color" content="#0e3faf" />
      </head>
      <body className={`
        ${openSans.className}
        ${openSans.variable}
        ${montserrat.variable}
        ${dmSans.variable}
        ${cormorant.variable}
        ${jetbrainsMono.variable}
        antialiased
      `}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsappButtonConditional />
      </body>
    </html>
  );
}