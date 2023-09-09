import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="m-auto flex min-h-screen flex-col items-center justify-center">
      <SignIn
        appearance={{
          baseTheme: currentTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}
