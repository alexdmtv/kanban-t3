import IconButton from "./icon-button";
import Image from "next/image";
import threeDotsSvg from "../../public/icon-vertical-ellipsis.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ThreeDotsMenu({
  menuTitle,
  children,
}: {
  menuTitle: string;
  children?: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="shrink-0">
        <IconButton>
          <Image src={threeDotsSvg as string} alt={menuTitle} />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{menuTitle}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
