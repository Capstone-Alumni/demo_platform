import Footer from '@share/components/layout/Footer';
import Header from '@share/components/layout/Header';
import IntroductionSection from 'src/modules/landing/components/IntroductionSection';

export default async function Page() {
  return (
    <div>
      <Header />
      <IntroductionSection />
      <Footer />
    </div>
  );
}
