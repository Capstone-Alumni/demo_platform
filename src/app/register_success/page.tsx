import Body from '@share/components/layout/Body';
import Footer from '@share/components/layout/Footer';
import Header from '@share/components/layout/Header';
import RegisterSuccess from 'src/modules/landing/components/RegisterSuccess';

export default async function Page() {
  return (
    <div>
      <Header />
      <Body sx={{ pt: 10, pb: 4 }}>
        <RegisterSuccess />
      </Body>
      <Footer />
    </div>
  );
}
