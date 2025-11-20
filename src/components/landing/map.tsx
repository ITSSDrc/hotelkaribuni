'use client';

import { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Hotel, Utensils, VenetianMask, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

const pointsOfInterest = [
  { id: 'hotel', lat: 48.8584, lng: 2.2945, label: 'Hôtel Karibuni', icon: Hotel },
  { id: 'restaurant', lat: 48.8600, lng: 2.2960, label: 'Restaurant Gastronomique', icon: Utensils },
  { id: 'theatre', lat: 48.8570, lng: 2.2920, label: 'Théâtre de la Rive', icon: VenetianMask },
  { id: 'shopping', lat: 48.8595, lng: 2.2915, label: 'Boutiques de Luxe', icon: ShoppingBag },
];

export default function MapSection() {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // This check runs only on the client-side
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null;
    setApiKey(key);
  }, []);

  const hotelPosition = { lat: 48.8584, lng: 2.2945 }; // Eiffel Tower as a placeholder

  if (apiKey === null) {
    // Waiting for useEffect to run
    return null;
  }

  return (
    <section id="map" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="font-headline text-4xl font-bold md:text-5xl">Un Emplacement d'Exception</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Idéalement situé, notre hôtel est le point de départ parfait pour explorer les merveilles de la ville.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="overflow-hidden shadow-xl">
              <CardContent className="h-[500px] p-0">
                {apiKey ? (
                  <APIProvider apiKey={apiKey}>
                    <Map
                      center={hotelPosition}
                      zoom={15}
                      mapId="karibuni-map"
                      disableDefaultUI={true}
                      gestureHandling="greedy"
                    >
                      {pointsOfInterest.map(point => (
                        <Marker key={point.id} position={{ lat: point.lat, lng: point.lng }} title={point.label} />
                      ))}
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <p className="max-w-xs text-center text-muted-foreground">
                      La carte ne peut pas être affichée. La clé API Google Maps est manquante.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="mb-4 font-headline text-2xl font-semibold">À Proximité</h3>
            <ul className="space-y-4">
              {pointsOfInterest.map(point => (
                <li key={point.id} className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <point.icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium">{point.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
