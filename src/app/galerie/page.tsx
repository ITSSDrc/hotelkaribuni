
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getGalleryImages, GalleryImage } from '@/lib/static-data';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


export default function GalleryPage() {
  const allImages = getGalleryImages();
  const categories = ['Tout', ...Array.from(new Set(allImages.map(img => img.category)))];
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = selectedCategory === 'Tout'
    ? allImages
    : allImages.filter(image => image.category === selectedCategory);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h1 className="font-headline text-4xl font-bold md:text-5xl">Galerie de l'Hôtel</h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Plongez dans l'univers de Karibuni. Explorez chaque recoin de notre établissement.
              </p>
            </div>

            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full mb-12">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mx-auto max-w-4xl">
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <Dialog>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {filteredImages.map((image) => (
                    <DialogTrigger asChild key={image.id} onClick={() => handleImageClick(image)}>
                        <Card className="group cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                            <CardContent className="relative aspect-square p-0">
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                            </CardContent>
                        </Card>
                    </DialogTrigger>
                ))}
                </div>
                 <DialogContent className="max-w-4xl p-0 border-0">
                    {selectedImage && (
                        <>
                            <DialogTitle className="sr-only">{selectedImage.alt}</DialogTitle>
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={selectedImage.url}
                                    alt={selectedImage.alt}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
