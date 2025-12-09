
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookie_consent');
    if (consent !== 'true') {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    setShowConsent(false);
    Cookies.set('cookie_consent', 'true', { expires: 365 });
  };
  
  const declineCookies = () => {
     setShowConsent(false);
     Cookies.set('cookie_consent', 'false', { expires: 365 });
  }

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-10 duration-500">
      <Card className="max-w-4xl mx-auto shadow-2xl">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-muted-foreground">
            <p>
              By continuing to browse our website, you consent to us deploying cookies as described in our{' '}
              <Link href="/confidentialite" className="underline text-primary hover:text-primary/80">
                Privacy & Cookie Policy
              </Link>
              . If you do not wish to accept cookies from our website you can manage your preferences in Cookie Settings.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <Button variant="outline" onClick={declineCookies}>Cookie Settings</Button>
            <Button onClick={acceptCookies}>Allow All Cookies</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
