import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <SignIn
      appearance={{
        elements: {
          rootBox:
            "flex flex-col items-center justify-center min-h-screen m-auto",
        },
        baseTheme: currentTheme === "dark" ? dark : undefined,
      }}
    />
  );
}
