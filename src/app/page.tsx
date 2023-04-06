import Footer from '@share/components/layout/Footer';
import Header from '@share/components/layout/Header';
import FeaturesSection from 'src/modules/landing/components/FeaturesSection';
import IntroductionSection from 'src/modules/landing/components/IntroductionSection';
import PricingPlan from 'src/modules/landing/components/PricingPlanSection';
import RegisterStep from 'src/modules/landing/components/RegisterStep';

export default async function Page() {
  return (
    <div>
      <Header />
      <IntroductionSection />
      <FeaturesSection />
      <RegisterStep />
      <PricingPlan />
      <Footer />
    </div>
  );
}
