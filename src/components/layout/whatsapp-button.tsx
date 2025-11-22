
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import QRCode from 'qrcode';
import Image from 'next/image';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);

export default function WhatsappButton() {
  const phoneNumber = '1234567890';
  const message = "Bonjour, j'aimerais avoir plus d'informations sur l'hôtel Karibuni.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(whatsappUrl, { width: 256, margin: 2 })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code', err);
      });
  }, [whatsappUrl]);


  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:bg-[#1DA851] hover:scale-110"
              >
                <WhatsAppIcon className="h-7 w-7" />
                <span className="sr-only">Contactez-nous sur WhatsApp</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-foreground text-background">
            <p>Information & Booking</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Discuter sur WhatsApp</DialogTitle>
          <DialogDescription>
            Scannez ce QR code avec votre téléphone pour discuter avec un agent de réservation.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4">
          {qrCodeUrl ? (
             <Image
                src={qrCodeUrl}
                alt="WhatsApp QR Code"
                width={256}
                height={256}
                className="rounded-lg"
              />
          ) : (
            <div className="h-64 w-64 animate-pulse rounded-lg bg-muted"></div>
          )}
          <Button asChild variant="link">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              ou cliquez ici pour continuer
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
