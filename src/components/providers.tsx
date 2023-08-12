import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "./sidebar-context";

export default function Providers({
  children,
  ...pageProps
}: {
  children: React.ReactNode;
  pageProps: object;
}) {
  return (
    <ClerkProvider {...pageProps}>
      <SidebarProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </SidebarProvider>
    </ClerkProvider>
  );
}
