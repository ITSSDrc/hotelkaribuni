
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
    fill="currentColor"
    {...props}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.5-5.613-1.458l-6.363 1.687zm5.273-4.525l.385.231c1.492.893 3.166 1.37 4.875 1.37 5.454 0 9.917-4.463 9.917-9.917 0-2.637-1.03-5.12-2.895-6.984-1.865-1.865-4.347-2.895-6.983-2.895-5.455 0-9.918 4.463-9.918 9.917 0 2.05.624 4.018 1.78 5.72l.44.633-1.07 3.887 3.98-1.045zm6.594-6.344c-.197-.099-1.17-.578-1.353-.646-.182-.068-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.23.149-.413.05-.182-.099-.767-.282-1.46-.906-.54-.486-.903-1.08-.99-1.263-.087-.182.008-.282.086-.368.079-.086.182-.232.27-.346.087-.114.114-.197.168-.33.055-.133.028-.248-.014-.346-.042-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.341-.114-.007-.247-.007-.38-.007-.133 0-.346.042-.527.22-.182.179-.699.677-.699 1.654 0 .977.717 1.916.814 2.05.099.133 1.408 2.172 3.413 3.007.482.205.864.329 1.159.417.471.137.884.118 1.213.071.36-.047 1.17-.48 1.336-.943.164-.464.164-.86.114-.943-.05-.083-.182-.133-.38-.232z"/>
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
                <WhatsAppIcon className="h-8 w-8" />
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
