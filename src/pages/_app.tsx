import { type AppType } from "next/app";
import { api } from "@/utils/api";
import "@/styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import MainLayout from "@/components/main-layout";
import Providers from "@/components/providers";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <Providers {...pageProps}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Providers>
  );
};

export default api.withTRPC(MyApp as AppType);
