
export const StaticData = {
    rooms: [
        {
            "id": "1",
            "name": "Chambre Standard",
            "type": "Standard",
            "description": "Une chambre confortable et élégante, parfaite pour les voyageurs seuls ou en couple, avec toutes les commodités modernes.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop"
            ],
            "amenities": [
                { "name": "Wi-Fi Gratuit", "icon": "Wifi" },
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "TV Écran Plat", "icon": "Tv" },
                { "name": "Service en chambre", "icon": "ConciergeBell" }
            ],
            "status": "Disponible"
        },
        {
            "id": "2",
            "name": "Chambre Deluxe Vue Mer",
            "type": "Deluxe",
            "description": "Profitez d'un espace généreux et d'une vue imprenable sur l'océan depuis votre balcon privé. Le luxe et le confort à leur apogée.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1590490359854-dfba5968267c?q=80&w=1974&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1560185893-a55de8537e2b?q=80&w=1974&auto=format&fit=crop"
            ],
            "amenities": [
                { "name": "Vue sur mer", "icon": "Waves" },
                { "name": "Balcon privé", "icon": "GalleryVerticalEnd" },
                { "name": "Wi-Fi Gratuit", "icon": "Wifi" },
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "Mini-bar", "icon": "GlassWater" }
            ],
            "status": "Disponible"
        },
        {
            "id": "3",
            "name": "Suite Royale",
            "type": "Suite",
            "description": "L'expérience ultime du luxe. Notre suite Royale dispose d'un salon séparé, d'une grande terrasse et de services exclusifs.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Salon séparé", "icon": "Sofa" },
                { "name": "Grande terrasse", "icon": "Sun" },
                { "name": "Baignoire Jacuzzi", "icon": "Bath" },
                { "name": "Services Exclusifs", "icon": "Star" },
                { "name": "Wi-Fi Haut Débit", "icon": "Wifi" }
            ],
            "status": "Occupée"
        }
    ],
    salles: [
        {
            "id": "salle-1",
            "name": "Salle de Conférence 'Horizon'",
            "capacity": 50,
            "price": 500,
            "description": "Un espace modulable et entièrement équipé pour vos séminaires, réunions et événements professionnels. Lumière naturelle et technologie de pointe.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Vidéo-projecteur", "icon": "MonitorPlay" },
                { "name": "Tableau blanc", "icon": "Presentation" },
                { "name": "Wi-Fi Haut Débit", "icon": "Wifi" },
                { "name": "Sonorisation", "icon": "Volume2" },
                { "name": "Climatisation", "icon": "AirVent" }
            ],
            "status": "Disponible"
        }
    ],
    piscines: [
         {
            "id": "piscine-1",
            "name": "Piscine Lagon",
            "type": "Extérieure",
            "description": "Notre piscine principale, un lagon d'eau douce entouré de palmiers et de transats pour une journée de pure détente.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1949&auto=format&fit=crop"
            ],
            "amenities": [
                { "name": "Transats et Parasols", "icon": "Umbrella" },
                { "name": "Serviettes fournies", "icon": "Check" },
                { "name": "Bar de piscine", "icon": "Martini" },
                { "name": "Espace enfants", "icon": "ToyBrick" }
            ],
            "status": "Ouverte"
        },
        {
            "id": "piscine-2",
            "name": "Bassin de Relaxation",
            "type": "Intérieure",
            "description": "Un espace intime et calme, avec une eau chauffée et des jets de massage. Parfait pour se détendre après une longue journée.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1582573739920-c2a7153a8a3a?q=80&w=1964&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Eau chauffée", "icon": "Thermometer" },
                { "name": "Jets de massage", "icon": "Waves" },
                { "name": "Ambiance calme", "icon": "Wind" },
                { "name": "Accès au spa", "icon": "Sparkles" }
            ],
            "status": "Ouverte"
        }
    ],
    restauBar: [
        {
            "id": "restau-1",
            "name": "Le Corail",
            "type": "Restaurant",
            "description": "Une cuisine gastronomique qui célèbre les produits de la mer et les saveurs locales dans un cadre élégant et raffiné.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop"
            ],
            "amenities": [
                { "name": "Produits frais et locaux", "icon": "Fish" },
                { "name": "Terrasse extérieure", "icon": "Sun" },
                { "name": "Menu dégustation", "icon": "Award" },
                { "name": "Cave à vin", "icon": "Grape" }
            ],
            "products": [
                { "name": "Filet de Capitaine à la Plancha", "description": "Servi avec sa purée de patates douces et une sauce aux agrumes.", "icon": "Fish" },
                { "name": "Poulet Braisé façon Karibuni", "description": "Mariné aux épices locales, accompagné de bananes plantains frites.", "icon": "Award" },
                { "name": "Salade Tropicale", "description": "Mélange de fruits exotiques, avocat, et crevettes fraîches.", "icon": "Sun" }
            ],
            "status": "Ouvert"
        },
        {
            "id": "bar-1",
            "name": "Le Sunset Lounge",
            "type": "Bar",
            "description": "Le lieu idéal pour admirer le coucher de soleil en sirotant un cocktail signature. Musique live certains soirs.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1543007168-5fa9b3c5951d?q=80&w=1974&auto=format&fit=crop"
            ],
            "amenities": [
                { "name": "Cocktails Signature", "icon": "Martini" },
                { "name": "Vue sur le coucher de soleil", "icon": "Sunrise" },
                { "name": "Musique Live", "icon": "Music" },
                { "name": "Tapas & Amuse-bouches", "icon": "Cookie" }
            ],
            "products": [
                { "name": "Mojito 'Ituri'", "description": "Rhum local, menthe fraîche, et une touche de fruit de la passion.", "icon": "Martini" },
                { "name": "Karibuni Spritz", "description": "Une version tropicale du classique italien avec des notes de mangue.", "icon": "Grape" },
                { "name": "Jus de fruits frais pressés", "description": "Ananas, papaye, mangue, selon la saison.", "icon": "Sun" }
            ],
            "status": "Ouvert"
        }
    ]
}

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  category: string;
};

export const getGalleryImages = (): GalleryImage[] => {
  const allImages: GalleryImage[] = [];

  StaticData.rooms.forEach(room => {
    room.imageUrls.forEach((url, index) => {
      allImages.push({
        id: `${room.id}-img-${index}`,
        url: url,
        alt: room.name,
        category: 'Chambres'
      });
    });
  });

  StaticData.salles.forEach(salle => {
    salle.imageUrls.forEach((url, index) => {
      allImages.push({
        id: `${salle.id}-img-${index}`,
        url: url,
        alt: salle.name,
        category: 'Salles'
      });
    });
  });

  StaticData.piscines.forEach(piscine => {
    piscine.imageUrls.forEach((url, index) => {
      allImages.push({
        id: `${piscine.id}-img-${index}`,
        url: url,
        alt: piscine.name,
        category: 'Piscines'
      });
    });
  });

  StaticData.restauBar.forEach(item => {
    item.imageUrls.forEach((url, index) => {
      allImages.push({
        id: `${item.id}-img-${index}`,
        url: url,
        alt: item.name,
        category: 'Restaurant & Bar'
      });
    });
  });

  return allImages;
};
