import Image from "next/image";
import mobileLogoSvg from "../../public/logo-mobile.svg";
import threeDotsSvg from "../../public/icon-vertical-ellipsis.svg";
import IconButton from "./icon-button";
import { MobileNavButton } from "./mobile-nav";
import UserButton from "./user-button";
import Button from "./button";
import type { Prisma } from "@prisma/client";
import { Skeleton } from "./ui/skeleton";

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
  console.log(isLoading);
  return (
    <div className="flex h-16 items-center border-lines-light bg-white dark:border-lines-dark dark:bg-dark-grey md:h-20 md:border-b lg:h-24">
      <div className="ml-4 md:ml-6">
        <Image
          src={mobileLogoSvg as string}
          alt="Logo"
          className="mr-4 md:hidden"
        />
      </div>

      <div className="flex items-center">
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
