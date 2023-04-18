import Header from '@share/components/layout/Header';
import CSRProvider from '../modules/share/components/CSRProider';

import 'quill/dist/quill.snow.css';
import Footer from '@share/components/layout/Footer';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from 'src/pages/api/auth/[...nextauth]';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await unstable_getServerSession(nextAuthOptions);

  return (
    <html lang="en">
      <head>
        <title>High school alumni management platform</title>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body style={{ margin: 0, minHeight: '100vh' }}>
        <CSRProvider>
          <Header session={session} />
          {children}
          <Footer />
        </CSRProvider>
      </body>
    </html>
  );
}
