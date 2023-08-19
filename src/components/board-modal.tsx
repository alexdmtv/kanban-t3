import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import type { BoardWithLists } from "@/lib/types";
import { BoardForm } from "./board-form";

export function BoardModal({
  board,
  open,
  onOpenChange,
}: {
  board?: BoardWithLists;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
