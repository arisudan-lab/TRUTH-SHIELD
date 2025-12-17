import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { FakeNewsSection } from '@/components/FakeNewsSection';
import { DeepfakeSection } from '@/components/DeepfakeSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <FakeNewsSection />
        <DeepfakeSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
