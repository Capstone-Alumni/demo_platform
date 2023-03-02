import CSRProvider from '../modules/share/components/CSRProider';

import 'quill/dist/quill.snow.css';

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
        <CSRProvider>{children}</CSRProvider>
      </body>
    </html>
  );
}
