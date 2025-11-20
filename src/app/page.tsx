import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Hero from '@/components/landing/hero';
import RoomShowcase from '@/components/landing/room-showcase';
import Booking from '@/components/landing/booking';
import Gallery from '@/components/landing/gallery';
import MapSection from '@/components/landing/map';
import Contact from '@/components/landing/contact';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <RoomShowcase />
        <Booking />
        <Gallery />
        <MapSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
