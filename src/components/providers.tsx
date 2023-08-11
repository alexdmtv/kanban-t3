import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

export default function Providers({
  children,
  ...pageProps
}: {
  children: React.ReactNode;
  pageProps: object;
}) {
  return (
    <ClerkProvider {...pageProps}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
}
