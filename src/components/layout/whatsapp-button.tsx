
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import QRCode from 'qrcode';
import Image from 'next/image';
import { Phone } from 'lucide-react';

export default function WhatsappButton() {
  const phoneNumber = '243822805628';
  const message = "Bonjour, je vous contacte depuis votre site web. J'aimerais avoir plus d'informations sur l'hôtel Karibuni à Bunia.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(whatsappUrl, { width: 256, margin: 1 })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code', err);
      });
  }, [whatsappUrl]);


  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:bg-[#1DA851] hover:scale-110"
              >
                <Phone className="h-7 w-7" />
                <span className="sr-only">Contactez-nous sur WhatsApp</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-foreground text-background">
            <p>Information & Booking</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent side="top" align="end" className="w-auto p-4 rounded-lg shadow-2xl space-y-4">
        <div className="text-center">
            <Label className="text-base font-semibold">Discuter sur WhatsApp</Label>
            <p className="text-sm text-muted-foreground mt-1">Scannez le code QR pour nous joindre.</p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-2">
          {qrCodeUrl ? (
             <Image
                src={qrCodeUrl}
                alt="WhatsApp QR Code"
                width={180}
                height={180}
                className="rounded-md border p-1"
              />
          ) : (
            <div className="h-[180px] w-[180px] animate-pulse rounded-md bg-muted"></div>
          )}
          <Button asChild variant="link" size="sm">
            <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Ouvrir la discussion
            </Link>
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground/80 pt-2 border-t">
            Powered by <a href="https://itssdrc.com" target="_blank" rel="noopener noreferrer" className="font-medium text-primary/80 hover:underline">itssdrc.com</a>
        </p>
      </PopoverContent>
    </Popover>
  );
}
