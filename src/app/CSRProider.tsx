'use client';

import { NextAppDirEmotionCacheProvider } from 'tss-react/next';
import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ThemeConfig from '@lib/mui';

export default function CSRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <RecoilRoot>
        <NextAppDirEmotionCacheProvider options={{ key: 'css' }}>
          <ThemeConfig>
            {children}{' '}
            <ToastContainer
              position="bottom-right"
              autoClose={3000}
              theme="colored"
            />
          </ThemeConfig>
        </NextAppDirEmotionCacheProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}
