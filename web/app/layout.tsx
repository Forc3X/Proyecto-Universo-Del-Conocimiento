import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import Header from '../components/Header';

export const metadata: Metadata = {
  title: 'Universo del Conocimiento',
  description:
    'Plataforma educativa gamificada para niños de 10–12 años. Explora planetas, aprende matemáticas, lengua y ciencias.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html lang="es" suppressHydrationWarning>
      <body className="bg-[#010103] text-white" suppressHydrationWarning>
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
