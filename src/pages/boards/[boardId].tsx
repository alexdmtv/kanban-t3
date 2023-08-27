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
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useState } from "react";
const BoardHeader = dynamic(() => import("@/components/board-header"), {
  loading: () => <Skeleton className="h-16 md:h-20 lg:h-24" />,
  ssr: false,
});

export default function BoardPage() {
  const router = useRouter();
  const boardId = +(router.query.boardId as string);

  const { openBoardModal } = useBoardModal();
  const { openTaskModal } = useTaskModal();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: board, isLoading } = api.boards.getById.useQuery({
    boardId,
  });
  const utils = api.useContext();
  const listReorderMutation = api.lists.reorder.useMutation({
    onSuccess: async () => {
      await utils.boards.getById.invalidate({ boardId });
    },
  });

  const [lists, setLists] = useState(board?.lists);

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

  useEffect(() => {
    setLists(board?.lists);
  }, [board]);

  return (
    <>
      <BoardHeader board={board} isLoading={isLoading} />

      {isLoading && (
        <div className="col-span-2 flex flex-col items-center justify-center">
          <Spinner className="h-20 w-20" />
        </div>
      )}

      {board && lists && board.lists.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lists.map((list) => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="overflow-auto">
              <div className="mx-4 my-6 grid min-h-[42rem] grid-flow-col justify-start gap-6 md:mx-6">
                {lists.map((list) => (
                  <BoardList key={list.id} list={list} />
                ))}
                <NewColumn board={board} />
              </div>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {board && board.lists.length === 0 && (
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
      )}

      {!board && !isLoading && <p>Board not found.</p>}
    </>
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setLists((lists) => {
        if (!lists) return lists;
        const oldIndex = lists.findIndex((list) => list.id === active.id);
        const newIndex = lists.findIndex((list) => list.id === over?.id);
        const maxPosition = Math.max(...lists.map((l) => l.boardPosition)) + 10;

        let newPosition: number;
        const updatedLists = arrayMove(lists, oldIndex, newIndex);

        if (newIndex === 0) {
          newPosition = updatedLists[newIndex + 1]!.boardPosition / 2;
        } else if (newIndex === lists.length - 1) {
          newPosition = maxPosition + 10;
        } else {
          newPosition =
            (updatedLists[newIndex - 1]!.boardPosition +
              updatedLists[newIndex + 1]!.boardPosition) /
            2;
        }

        listReorderMutation.mutate({
          listId: +active.id,
          newPosition,
        });

        return updatedLists;
      });
    }
  }
}

BoardPage.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
