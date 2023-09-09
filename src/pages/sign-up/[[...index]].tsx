import { SignUp } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function Page() {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="m-auto flex min-h-screen flex-col items-center justify-center">
      <SignUp
        appearance={{
          baseTheme: currentTheme === "dark" ? dark : undefined,
        }}
      />
    </div>
  );
}
