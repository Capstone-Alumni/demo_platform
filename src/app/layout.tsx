import Header from '@share/components/layout/Header';
import CSRProvider from '../modules/share/components/CSRProider';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>High school alumni management platform</title>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <link rel="shortcut icon" href="/logo.png" />
      </head>
      <body style={{ margin: 0, minHeight: '100vh' }}>
        <CSRProvider>
          <Header />
          {children}
        </CSRProvider>
      </body>
    </html>
  );
}
