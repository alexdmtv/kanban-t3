import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { BoardForm } from "./board-form";
import { useBoardModal } from "@/lib/store";

export function BoardModal() {
  const { boardModalData, boardModalOpen, closeBoardModal } = useBoardModal();
  return (
    <Dialog
      open={boardModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeBoardModal();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start justify-between">
            <h1 className="text-heading-l">
              {boardModalData ? "Edit Board" : "Create New Board"}
            </h1>
          </div>
        </DialogHeader>
        <BoardForm board={boardModalData} />
      </DialogContent>
    </Dialog>
  );
}
