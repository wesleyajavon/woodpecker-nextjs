
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="pt-20">
        <Hero />
        <FeaturedProducts />
      </div>
      <Footer />
    </main>
  );
}
