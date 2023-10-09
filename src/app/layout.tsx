import './globals.css';
import type { Metadata } from 'next';
import { Comfortaa } from 'next/font/google';

import Provider from '@/app/_trpc/Provider';

const comfortaa = Comfortaa({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={comfortaa.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
