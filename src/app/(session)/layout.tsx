import Body from '@share/components/layout/Body';
import Footer from '@share/components/layout/Footer';
import Header from '@share/components/layout/Header';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Body sx={{ paddingY: 0 }}>{children}</Body>
    </>
  );
}
