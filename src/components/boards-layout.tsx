import FloatingAddButton from "./floating-add-button";
import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";
import { BoardModal } from "./board-modal";
import { TaskModal } from "./task-modal";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { useTaskModal } from "@/lib/store";
const Sidebar = dynamic(() => import("./sidebar"), {
  loading: () => (
    <Skeleton className="hidden flex-col border-r border-lines-light bg-white pb-8 dark:border-lines-dark dark:bg-dark-grey md:col-span-1 md:flex" />
  ),
  ssr: false,
});

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: board } = api.boards.getById.useQuery({
    boardId: +(router.query.boardId as string),
  });

  const { openTaskModal } = useTaskModal();

  return (
    <div className="grid h-full grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="col-span-2 grid h-screen grid-cols-1 grid-rows-[auto_1fr] md:col-span-1">
        {children}
      </div>
      {board && (
        <FloatingAddButton
          className="md:hidden"
          onClick={() =>
            openTaskModal({ taskBoard: board, selectedTask: null })
          }
        />
      )}

      <BoardModal />
      <TaskModal />
    </div>
  );
}
