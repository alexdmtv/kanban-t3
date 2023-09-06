import BoardsLayout from "@/components/boards-layout";
import Button from "@/components/button";
import NewColumn from "@/components/new-column";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, type ReactElement, useState } from "react";

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
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { ListWithTasksAndSubtasks } from "@/lib/types";
import SortableBoardList from "@/components/sortable-board-list";
import BoardList from "@/components/board-list";

const BoardHeader = dynamic(() => import("@/components/board-header"), {
  loading: () => <Skeleton className="h-16 md:h-20 lg:h-24" />,
  ssr: false,
});

export default function BoardPage() {
  const router = useRouter();
  const boardId = +(router.query.boardId as string);
  const [activeList, setActiveList] = useState<ListWithTasksAndSubtasks | null>(
    null
  );

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

  return (
    <>
      <BoardHeader board={board} isLoading={isLoading} />

      {isLoading && (
        <div className="col-span-2 flex flex-col items-center justify-center">
          <Spinner className="h-20 w-20" />
        </div>
      )}

      {board && board.lists.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={board.lists.map((list) => list.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="overflow-auto">
              <div className="mx-4 my-6 grid min-h-[42rem] grid-flow-col justify-start gap-6 md:mx-6">
                {board.lists.map((list) => (
                  <SortableBoardList key={list.id} list={list} />
                ))}
                <NewColumn board={board} />
              </div>
            </div>
          </SortableContext>
          <DragOverlay>
            {activeList && <BoardList list={activeList} />}
          </DragOverlay>
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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;

    if (active.data.current?.type === "list") {
      setActiveList(active.data.current.list as ListWithTasksAndSubtasks);
      return;
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveList(null);

    const { active, over } = event;

    if (active.id === over?.id) return;
    if (!board?.lists) return;

    const oldIndex = board.lists.findIndex((list) => list.id === active.id);
    const newIndex = board.lists.findIndex((list) => list.id === over?.id);

    const maxPosition =
      Math.max(...board.lists.map((l) => l.boardPosition)) + 10;

    let newPosition: number;
    const updatedLists = arrayMove(board.lists, oldIndex, newIndex);
    const nextList = updatedLists[newIndex + 1];
    const prevList = updatedLists[newIndex - 1];

    if (newIndex === 0 && nextList) {
      newPosition = nextList.boardPosition / 2;
    } else if (newIndex === board.lists.length - 1) {
      newPosition = maxPosition + 10;
    } else {
      newPosition = (prevList!.boardPosition + nextList!.boardPosition) / 2;
    }

    utils.boards.getById.setData({ boardId }, (prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        lists: updatedLists.map((list, i) => {
          if (i === newIndex) return { ...list, boardPosition: newPosition };
          return list;
        }),
      };
    });

    listReorderMutation.mutate({
      listId: +active.id,
      newPosition,
    });
  }
}

BoardPage.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
