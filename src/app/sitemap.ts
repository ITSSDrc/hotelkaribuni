import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://karibuni-bunia.com'; // Remplacez par votre nom de domaine final

  // On ajoute les pages statiques
  const staticRoutes = [
    '',
    '/chambres',
    '/salles',
    '/piscines',
    '/restau-bar',
    '/galerie',
    '/a-propos',
    '/reservation',
    '/confidentialite',
    '/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Idéalement, nous ajouterions ici les pages dynamiques (ex: /chambres/1, /salles/salle-1),
  // mais pour commencer, les pages principales sont le plus important.

  return [
    ...staticRoutes,
  ];
}