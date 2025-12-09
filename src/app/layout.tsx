
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { DM_Sans } from 'next/font/google';
import { Providers } from '@/components/layout/providers';


const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' });


export const metadata: Metadata = {
  title: 'Hôtel Karibuni | Bunia, Ituri',
  description:
    "Bienvenue à l'Hôtel Karibuni, votre oasis de luxe à Bunia, Ituri. Profitez de nos chambres, services et expériences inoubliables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', dmSans.variable)}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
