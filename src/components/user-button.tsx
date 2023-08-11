import { UserButton as UB } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { cn } from "@/lib/utils";

export default function UserButton({ className }: { className?: string }) {
  const { theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className={cn("rounded-full border-2 border-gray-400", className)}>
      <UB
        afterSignOutUrl="/"
        userProfileUrl="/profile"
        appearance={{ baseTheme: currentTheme === "dark" ? dark : undefined }}
      />
    </div>
  );
}
