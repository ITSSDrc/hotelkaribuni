
'use client';

import { useState, useCallback, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';


export default function GalleryPage() {
  const allImages = getGalleryImages();
  const categories = ['Tout', ...Array.from(new Set(allImages.map(img => img.category)))];
  const [selectedCategory, setSelectedCategory] = useState('Tout');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const filteredImages = selectedCategory === 'Tout'
    ? allImages
    : allImages.filter(image => image.category === selectedCategory);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const handleClose = () => setSelectedImageIndex(null);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex! + 1) % filteredImages.length);
    }
  }, [selectedImageIndex, filteredImages.length]);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex! - 1 + filteredImages.length) % filteredImages.length);
    }
  }, [selectedImageIndex, filteredImages.length]);

  const handleKeyDown = useCallback((event: globalThis.KeyboardEvent) => {
    if (selectedImageIndex !== null) {
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'Escape') {
        handleClose();
      }
    }
  }, [selectedImageIndex, handleNext, handlePrevious]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);


  const selectedImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

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
            
            <Dialog open={selectedImageIndex !== null} onOpenChange={(isOpen) => !isOpen && handleClose()}>
                <div key={selectedCategory} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 animate-fade-in">
                {filteredImages.map((image, index) => (
                    <DialogTrigger asChild key={image.id} onClick={() => handleImageClick(index)}>
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
                 <DialogContent className="max-w-4xl w-full p-0 border-0 bg-transparent shadow-none" onKeyDown={handleKeyDown as any}>
                    {selectedImage && (
                        <>
                            <div className="relative aspect-video w-full">
                                <Image
                                    src={selectedImage.url}
                                    alt={selectedImage.alt}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <DialogTitle className="absolute bottom-4 left-1/2 -translate-x-1/2 w-auto whitespace-nowrap rounded-md bg-black/50 px-4 py-2 text-base text-white flex items-center gap-2">
                                <span>{selectedImage.alt}</span>
                                {filteredImages.length > 1 && (
                                  <>
                                  <span className='text-white/70'>•</span>
                                  <span className="text-sm text-white/70">{selectedImageIndex! + 1} / {filteredImages.length}</span>
                                  </>
                                )}
                            </DialogTitle>

                            {filteredImages.length > 1 && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 text-foreground"
                                        onClick={handlePrevious}
                                    >
                                        <ChevronLeft className="h-8 w-8" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 text-foreground"
                                        onClick={handleNext}
                                    >
                                        <ChevronRight className="h-8 w-8" />
                                    </Button>
                                </>
                            )}
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
