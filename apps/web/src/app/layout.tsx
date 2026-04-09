import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import { Providers } from '@/components/providers';

import './globals.css';

// Geist Sans — шрифт от Vercel, оптимизирован для UI
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'Flashlang',
  description: 'Изучай английский через тексты и флеш-карточки',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={geist.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
