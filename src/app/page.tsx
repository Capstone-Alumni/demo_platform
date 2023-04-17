import FeaturesSection from 'src/modules/landing/components/FeaturesSection';
import IntroductionSection from 'src/modules/landing/components/IntroductionSection';
import PricingPlan from 'src/modules/landing/components/PricingPlanSection';
import RegisterStep from 'src/modules/landing/components/RegisterStep';

export default async function Page() {
  return (
    <div>
      <IntroductionSection />
      <FeaturesSection />
      <RegisterStep />
      <PricingPlan />
    </div>
  );
}
