
export const StaticData = {
    rooms: [
        {
            "id": "ch-eco",
            "name": "Chambre Standard Ventilée",
            "type": "Standard",
            "description": "Une chambre simple et confortable équipée d'un ventilateur. L'accès à internet est disponible gratuitement dans nos espaces communs comme le restaurant.",
            "price": 30,
            "imageUrls": [
                "/images/cat-1.jpg",
                "/images/cat-11.jpg",
                "/images/cat-12.jpg",
                "/images/cat-13.jpg"
            ],
            "amenities": [
                { "name": "Ventilateur", "icon": "Wind" },
                { "name": "Télévision", "icon": "Tv" },
                { "name": "Douche privée", "icon": "Bath" },
                { "name": "Wi-Fi (Restaurant)", "icon": "Wifi" }
            ],
            "status": "Disponible"
        },
        {
            "id": "ch-standard-ventile",
            "name": "Chambre Standard",
            "type": "Standard",
            "description": "Profitez du confort dans cette chambre élégante équipée d'un ventilateur, idéale pour un séjour agréable. Internet est disponible au restaurant.",
            "price": 40,
            "imageUrls": [
                "/images/cat-2.jpg",
                "/images/cat-21.jpg",
                "/images/cat-22.jpg"
            ],
            "amenities": [
                { "name": "Ventilateur", "icon": "Wind" },
                { "name": "TV Écran Plat", "icon": "Tv" },
                { "name": "Service en chambre", "icon": "ConciergeBell" },
                { "name": "Wi-Fi (Restaurant)", "icon": "Wifi" }
            ],
            "status": "Disponible"
        },
        {
            "id": "ch-confort-ac",
            "name": "Chambre Confort Climatisée",
            "type": "Confort",
            "description": "Le confort de la climatisation et une connexion internet en chambre. Un choix idéal pour les voyageurs d'affaires ou de loisirs.",
            "price": 50,
            "imageUrls": [
                "/images/cat-3.jpg",
                "/images/cat-31.jpg",
                "/images/cat-32.jpg"
            ],
            "amenities": [
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "Wi-Fi en chambre", "icon": "Wifi" },
                { "name": "Télévision", "icon": "Tv" },
                { "name": "Service en chambre", "icon": "ConciergeBell" }
            ],
            "status": "Disponible"
        },
        {
            "id": "ch-deluxe",
            "name": "Chambre Deluxe",
            "type": "Deluxe",
            "description": "Un espace généreux avec un coin salon, un balcon privé et une vue agréable. Le luxe et le confort à leur apogée.",
            "price": 60,
            "imageUrls": [
                "/images/cat-4.jpg",
                "/images/cat-41.jpg",
                "/images/cat-42.jpg",
                "/images/cat-43.jpg"
            ],
            "amenities": [
                { "name": "Balcon privé", "icon": "GalleryVerticalEnd" },
                { "name": "Wi-Fi en chambre", "icon": "Wifi" },
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "Mini-bar", "icon": "GlassWater" },
                { "name": "Coin salon", "icon": "Sofa" }
            ],
            "status": "Disponible"
        },
        {
            "id": "semi-apt",
            "name": "Semi-Appartement",
            "type": "Suite",
            "description": "Un espace généreux avec un coin salon pour plus d'autonomie et de flexibilité durant votre séjour.",
            "price": 80,
            "imageUrls": [
                "https://images.unsplash.com/photo-1629079448222-0331613589b9?q=80&w=1974&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1605346484971-d82c6b38b695?q=80&w=2070&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Coin Salon", "icon": "Sofa" },
                { "name": "Grande terrasse", "icon": "Sun" },
                { "name": "Wi-Fi Haut Débit", "icon": "Wifi" },
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "Services Exclusifs", "icon": "Star" }
            ],
            "status": "Occupée"
        },
        {
            "id": "apt",
            "name": "Appartement Complet",
            "type": "Suite",
            "description": "L'expérience ultime pour les longs séjours. Un appartement complet avec salon séparé, cuisine équipée et services hôteliers.",
            "price": 100,
            "imageUrls": [
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Salon séparé", "icon": "Sofa" },
                { "name": "Cuisine équipée", "icon": "Sun" },
                { "name": "Baignoire", "icon": "Bath" },
                { "name": "Services Exclusifs", "icon": "Star" },
                { "name": "Wi-Fi Haut Débit", "icon": "Wifi" }
            ],
            "status": "Disponible"
        },
        {
            "id": "suite-prez",
            "name": "Suite Présidentielle",
            "type": "Suite",
            "description": "Le summum du luxe. Une suite opulente avec un salon spacieux, une cuisine entièrement équipée, et des services personnalisés pour un séjour inoubliable.",
            "price": 120,
            "imageUrls": [
                "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Salon spacieux", "icon": "Sofa" },
                { "name": "Baignoire Jacuzzi", "icon": "Bath" },
                { "name": "Climatisation centrale", "icon": "AirVent" },
                { "name": "Services VIP", "icon": "Star" },
                { "name": "Wi-Fi Premium", "icon": "Wifi" }
            ],
            "status": "Disponible"
        }
    ],
    salles: [
        {
            "id": "salle-grande-polyvalente",
            "name": "Grande salle polyvalente",
            "capacity": 300,
            "price": 300,
            "description": "Notre plus grand espace, parfait pour les conférences, mariages ou grands événements. Modulable pour s'adapter à vos besoins.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "Sonorisation complète", "icon": "Volume2" },
                { "name": "Rétroprojecteur", "icon": "MonitorPlay" },
                { "name": "Scène modulable", "icon": "Presentation" },
                { "name": "Wi-Fi Haut Débit", "icon": "Wifi" }
            ],
            "status": "Disponible"
        },
        {
            "id": "salle-moyenne",
            "name": "Salle Moyenne",
            "capacity": 150,
            "price": 150,
            "description": "Une salle de taille intermédiaire, idéale pour les séminaires, formations ou réceptions de taille moyenne. Entièrement équipée pour garantir le succès de votre événement.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "Sonorisation", "icon": "Volume2" },
                { "name": "Rétroprojecteur", "icon": "MonitorPlay" },
                { "name": "Wi-Fi", "icon": "Wifi" }
            ],
            "status": "Disponible"
        },
        {
            "id": "salle-reunion",
            "name": "Salle de Réunion",
            "capacity": 30,
            "price": 100,
            "description": "Un cadre discret et professionnel pour vos réunions d'affaires, entretiens ou petites sessions de travail.",
            "imageUrls": [
                "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
            ],
             "amenities": [
                { "name": "Climatisation", "icon": "AirVent" },
                { "name": "Rétroprojecteur", "icon": "MonitorPlay" },
                { "name": "Wi-Fi", "icon": "Wifi" },
                { "name": "Ambiance feutrée", "icon": "Wind" }
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
                "/images/restau-1.jpg"
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

    
    
