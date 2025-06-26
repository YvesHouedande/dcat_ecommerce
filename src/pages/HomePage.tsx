import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PromoSection from '../components/home/PromoSection';
import BenefitsSection from '../components/home/BenefitsSection';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'DCAT Shop - Professional Audio & Visual Equipment';
  }, []);

  return (
    <div>
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoSection />
      <BenefitsSection />
    </div>
  );
};

export default HomePage;