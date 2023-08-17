import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import type { BoardWithLists } from "@/lib/types";
import { BoardForm } from "./board-form";
import type { Dispatch, SetStateAction } from "react";

export function BoardModal({
  board,
  open,
  setOpen,
}: {
  board?: BoardWithLists;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start justify-between">
            <h1 className="text-heading-l">
              {board ? "Edit Board" : "Create New Board"}
            </h1>
          </div>
        </DialogHeader>
        <BoardForm board={board} />
      </DialogContent>
    </Dialog>
  );
}
