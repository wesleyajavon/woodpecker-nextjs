
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <div>
        <Hero />
        <FeaturedProducts />
      </div>
      <Footer />
    </main>
  );
}
