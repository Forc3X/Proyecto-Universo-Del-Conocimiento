
import PowerSyncInitializer from '../powersync/PowerSync_initializer';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FondoWrapper from './FondoWrapper';
import { Outfit } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';

const outfit = Outfit({ subsets: ['latin'], weight: ['400', '600', '700', '900'] });

export const metadata: Metadata = {
  title: 'Universo del Conocimiento',
  description:
    'Plataforma educativa gamificada para niños de 10–12 años. Explora planetas, aprende matemáticas, lengua y ciencias.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`${outfit.className} bg-[#010103] text-white`}>
        <FondoWrapper />
        <PowerSyncInitializer />
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
