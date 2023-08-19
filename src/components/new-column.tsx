import { useState } from "react";
import { BoardModal } from "./board-modal";
import { type BoardWithLists } from "@/lib/types";

export default function NewColumn({ board }: { board: BoardWithLists }) {
  const [boardModalOpen, setBoardModalOpen] = useState(false);

  return (
    <div className="pr-6 ">
      <div className="flex h-full w-[17.5rem] flex-col">
        {/* List Header */}
        <div className="flex items-center invisible gap-3">
          <div className="h-[15px] w-[15px] rounded-full bg-slate-600" />
          <h2 className="uppercase text-heading-s text-medium-grey">
            New Column
          </h2>
        </div>
        {/* Add new column button */}
        <button
          onClick={() => {
            setBoardModalOpen(true);
          }}
          className="mt-6 grow rounded-md bg-gradient-to-b from-[#E9EFFA] to-[#E9EFFA]/50 text-heading-xl text-medium-grey hover:text-main-purple dark:from-[#2B2C37]/25 dark:to-[#2B2C37]/10"
        >
          New column
        </button>
      </div>

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
