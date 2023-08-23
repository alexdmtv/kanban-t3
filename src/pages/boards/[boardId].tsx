import BoardList from "@/components/board-list";
import BoardsLayout from "@/components/boards-layout";
import Button from "@/components/button";
import NewColumn from "@/components/new-column";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, type ReactElement } from "react";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoardModal, useTaskModal } from "@/lib/store";
const BoardHeader = dynamic(() => import("@/components/board-header"), {
  loading: () => <Skeleton className="h-16 md:h-20 lg:h-24" />,
  ssr: false,
});

export default function BoardPage() {
  const router = useRouter();
  const { openBoardModal } = useBoardModal();
  const { openTaskModal } = useTaskModal();

  const { data: board, isLoading } = api.boards.getById.useQuery({
    boardId: +(router.query.boardId as string),
  });

  const selectedTask = board?.lists
    ?.flatMap((list) => list.tasks)
    .find((task) => task.id === +(router.query.taskId as string));

  useEffect(() => {
    if (router.query.taskId && board && selectedTask) {
      openTaskModal({
        selectedTask: selectedTask,
        taskBoard: board,
      });
      return;
    }
  }, [router.query.taskId, selectedTask, board, openTaskModal]);

  // Data is finished loading, but there is no board
  if (!board && !isLoading) return <p>Board not found.</p>;

  // Data is finished loading, but there are no lists
  if (!isLoading && board?.lists?.length === 0) {
    return (
      <>
        <BoardHeader board={board} />
        <div className="flex flex-col items-center justify-center gap-8 text-center text-heading-l text-medium-grey">
          <h1>This board is empty. Create a new list to get started.</h1>
          <Button
            onClick={() => openBoardModal(board)}
            btnType="primary"
            size="L"
            className="w-auto px-5"
          >
            + Create New List
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <BoardHeader {...(board ? { board } : { isLoading })} />
      {isLoading ? (
        <div className="col-span-2 flex flex-col items-center justify-center">
          <Spinner className="h-20 w-20" />
        </div>
      ) : (
        <div className="overflow-auto">
          <div className="mx-4 my-6 grid min-h-[42rem] grid-flow-col justify-start gap-6 md:mx-6">
            {board?.lists?.map((list) => (
              <BoardList key={list.id} list={list} />
            ))}
            {board && <NewColumn board={board} />}
          </div>
        </div>
      )}
    </>
  );
}

BoardPage.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
