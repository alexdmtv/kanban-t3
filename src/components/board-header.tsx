import Image from "next/image";
import mobileLogoSvg from "../../public/logo-mobile.svg";
import threeDotsSvg from "../../public/icon-vertical-ellipsis.svg";
import IconButton from "./icon-button";
import { MobileNavButton } from "./mobile-nav";
import UserButton from "./user-button";
import Button from "./button";
import type { Prisma } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";
import { useSidebar } from "./sidebar-context";
import DesktopLogo from "./desktop-logo";
import { cn } from "@/lib/utils";

type BoardWithListsTasksSubtasks = Prisma.boardsGetPayload<{
  include: {
    lists: {
      include: {
        tasks: {
          include: {
            subtasks: true;
          };
        };
      };
    };
  };
}>;

export default function BoardHeader({
  board,
  isLoading,
}: {
  board: BoardWithListsTasksSubtasks | null | undefined;
  isLoading?: boolean;
}) {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-16 items-center border-lines-light bg-white dark:border-lines-dark dark:bg-dark-grey md:h-20 md:border-b lg:h-24">
      <div
        className={cn("ml-4 flex h-full items-center md:ml-6", {
          "border-lines-light dark:border-lines-dark md:border-r md:pr-8":
            collapsed,
        })}
      >
        <Image
          src={mobileLogoSvg as string}
          alt="Logo"
          className="mr-4 md:hidden"
        />
        {collapsed && <DesktopLogo className="hidden md:block" />}
      </div>

      <div
        className={cn("flex h-full items-center", {
          "md:pl-8": collapsed,
        })}
      >
        {isLoading ? (
          <Skeleton className="h-7 w-[10rem]" />
        ) : (
          <h1 className="text-heading-l">{board?.name ?? "Kanban App"}</h1>
        )}
        <MobileNavButton className="md:hidden" />
      </div>

      <div className="ml-auto mr-2">
        <Button btnType="primary" size="L" className="hidden px-6 md:block">
          + Add New Task
        </Button>
        <UserButton className="md:hidden" />
      </div>

      <IconButton>
        <Image src={threeDotsSvg as string} alt="Board menu" />
      </IconButton>
    </div>
  );
}
