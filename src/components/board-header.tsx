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
import { useState } from "react";
import { BoardDeleteAlert } from "./board-delete-alert";
import { useBoardModal, useTaskModal } from "@/lib/store";

export default function BoardHeader({
  board,
  isLoading,
}: {
  board?: BoardWithListsTasksSubtasks | null;
  isLoading?: boolean;
}) {
  const { collapsed } = useSidebar();
  const { openBoardModal } = useBoardModal();
  const { openTaskModal } = useTaskModal();
  const [boardDeleteAlertOpen, setBoardDeleteAlertOpen] = useState(false);

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

      {board && (
        <div className="ml-auto mr-2">
          <Button
            onClick={() =>
              openTaskModal({ taskBoard: board, selectedTask: null })
            }
            btnType="primary"
            size="L"
            className="hidden px-6 md:block"
            disabled={board?.lists.length === 0}
          >
            + Add New Task
          </Button>

          <UserButton className="md:hidden" />
        </div>
      )}

      {board && (
        <ThreeDotsMenu menuTitle="Board menu">
          <DropdownMenuItem onSelect={() => openBoardModal(board)}>
            Edit board
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red"
            onSelect={() => setBoardDeleteAlertOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </ThreeDotsMenu>
      )}

      {board && (
        <BoardDeleteAlert
          board={board}
          open={boardDeleteAlertOpen}
          onOpenChange={setBoardDeleteAlertOpen}
        />
      )}
    </div>
  );
}
