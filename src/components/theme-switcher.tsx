import darkThemeIcon from "../../public/icon-dark-theme.svg";
import lightThemeIcon from "../../public/icon-light-theme.svg";
import Image from "next/image";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";

export default function ThemeSwitcher() {
  const { setTheme, theme, systemTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="ml-6 mt-4 flex flex-nowrap items-center justify-center gap-6 rounded-lg bg-light-grey py-3.5 dark:bg-very-dark-grey">
      <Image src={lightThemeIcon as string} alt="Light theme" />
      <Switch
        id="theme-switcher"
        defaultChecked={currentTheme === "dark" ? true : false}
        className="data-[state=checked]:bg-main-purple data-[state=unchecked]:bg-main-purple dark:data-[state=checked]:bg-main-purple dark:data-[state=unchecked]:bg-main-purple"
        onCheckedChange={(checked) => {
          setTheme(checked ? "dark" : "light");
        }}
      />
      <Image src={darkThemeIcon as string} alt="Dark theme" />
    </div>
  );
}
