import Head from "next/head";
import { Toaster } from "./ui/toaster";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>Kanban App</title>
        <meta
          name="description"
          content="Kanban app built with Next.js and TailwindCSS"
          key="description"
        />
        <link rel="icon" href="/icon.png" key="favicon" />
      </Head>
      <main className="">{children}</main>
      <Toaster />
    </>
  );
}
