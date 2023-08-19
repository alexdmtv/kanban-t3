import Image from "next/image";
import mobileLogoSvg from "../../public/logo-mobile.svg";
import { MobileNavButton } from "./mobile-nav";
import UserButton from "./user-button";
import Button from "./button";
import { Skeleton } from "./ui/skeleton";
import { useSidebar } from "./sidebar-context";
import DesktopLogo from "./desktop-logo";
import { cn } from "@/lib/utils";
import type { BoardWithListsTasksSubtasks } from "@/lib/types";
import { ThreeDotsMenu } from "./three-dots-menu";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { BoardModal } from "./board-modal";
import { useState } from "react";
import { TaskModal } from "./task-modal";

export default function BoardHeader({
  board,
  isLoading,
}: {
  board?: BoardWithListsTasksSubtasks;
  isLoading?: boolean;
}) {
  const { collapsed } = useSidebar();
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);

  return (
    <div className="flex items-center h-16 bg-white border-lines-light dark:border-lines-dark dark:bg-dark-grey md:h-20 md:border-b lg:h-24">
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
        <Button
          onClick={() => setTaskModalOpen(true)}
          btnType="primary"
          size="L"
          className="hidden px-6 md:block"
        >
          + Add New Task
        </Button>

        {board && (
          <TaskModal
            board={board}
            open={taskModalOpen}
            setOpen={setTaskModalOpen}
          />
        )}

        <UserButton className="md:hidden" />
      </div>

      <ThreeDotsMenu menuTitle="Board menu">
        <DropdownMenuItem onSelect={() => setBoardModalOpen(true)}>
          Edit board
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red">Delete</DropdownMenuItem>
      </ThreeDotsMenu>

      <BoardModal
        open={boardModalOpen}
        board={board}
        onOpenChange={(open) => {
          setBoardModalOpen(open);
        }}
      />
    </div>
  );
}
