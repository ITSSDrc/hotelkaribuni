
'use client';

import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import WhatsappButton from '@/components/layout/whatsapp-button';
import { Analytics } from '@vercel/analytics/react';
import CookieConsent from './cookie-consent';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <WhatsappButton />
      <Toaster />
      <Analytics />
      <CookieConsent />
    </ThemeProvider>
  );
}
