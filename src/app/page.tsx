import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/landing/hero';
import Booking from '@/components/landing/booking';
import Gallery from '@/components/landing/gallery';
import Contact from '@/components/landing/contact';
import Salle from '@/components/landing/salle';
import Piscines from '@/components/landing/piscines';
import RestauBar from '@/components/landing/restau-bar';
import RoomShowcase from '@/components/landing/room-showcase';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <Booking />
        <RoomShowcase />
        <Salle />
        <Piscines />
        <RestauBar />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
