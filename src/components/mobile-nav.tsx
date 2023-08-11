import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Nav from "./nav";
import IconButton from "./icon-button";
import Image from "next/image";
import chevronDownSvg from "../../public/icon-chevron-down.svg";
import { cn } from "@/lib/utils";

export function MobileNavButton({ className }: { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton className={cn("", className)}>
          <Image src={chevronDownSvg as string} alt="Nav menu" />
        </IconButton>
      </DialogTrigger>
      <DialogContent className="top-[15%] w-5/6 translate-y-[-15%] rounded-xl bg-white py-4 pl-0 pr-6 transition-colors duration-0 dark:bg-dark-grey sm:max-w-[425px]">
        <Nav />
      </DialogContent>
    </Dialog>
  );
}
