import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Page() {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <SignUp
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
