'use client';

import { DottedSurface } from '@/components/ui/dotted-surface';
import { cn } from '@/lib/utils';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';

const LandingSection = () => {
  return (
    <section className="relative min-h-screen bg-background">
      {/* Dotted Surface Background with dark theme gradient effect */}
      <DottedSurface className="size-full z-0 mt-65" />
      
      {/* Gradient overlay - adaptatif au thème */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
            'bg-[radial-gradient(ellipse_at_center,var(--theme-gradient),transparent_50%)]',
            'blur-[30px]',
          )}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Hero />
        <FeaturedProducts />
      </div>
    </section>
  );
};

export default LandingSection;
