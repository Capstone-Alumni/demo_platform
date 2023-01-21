'use client';

import React from 'react';
import { RecoilRoot } from 'recoil';
import { SessionProvider } from 'next-auth/react';

import { CacheProvider } from '@emotion/react';
import ThemeConfig from '@lib/mui';
import createEmotionCache from '@share/utils/createEmotionCache';

const clientSideEmotionCache = createEmotionCache();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const emotionCache = clientSideEmotionCache;

  return (
    <html lang="en">
      <head>
        <title>High school alumni management platform</title>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </head>
      <body style={{ margin: 0, minHeight: '100vh' }}>
        <SessionProvider>
          <CacheProvider value={emotionCache}>
            <RecoilRoot>
              <ThemeConfig>{children}</ThemeConfig>
            </RecoilRoot>
          </CacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
