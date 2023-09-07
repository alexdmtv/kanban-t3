import BoardsLayout from "@/components/boards-layout";
import Button from "@/components/button";
import NewColumn from "@/components/new-column";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, type ReactElement, useState, useMemo } from "react";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { useBoardModal, useTaskModal } from "@/lib/store";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { ListWithTasksAndSubtasks, TaskWithSubtasks } from "@/lib/types";
import SortableBoardList from "@/components/sortable-board-list";
import BoardList from "@/components/board-list";
import TaskCard from "@/components/task-card";
import { cn } from "@/lib/utils";

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
  const [activeTask, setActiveTask] = useState<TaskWithSubtasks | null>(null);

  const { openBoardModal } = useBoardModal();
  const { openTaskModal } = useTaskModal();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { data: board, isLoading } = api.boards.getById.useQuery({
    boardId,
  });
  const listIds = useMemo(
    () => board?.lists?.map((list) => "list_" + list.id),
    [board]
  );
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
          // collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
        >
          <div className="overflow-auto">
            <div className="mx-4 my-6 grid min-h-[42rem] grid-flow-col justify-start gap-6 md:mx-6">
              <SortableContext
                items={listIds ?? []}
                strategy={horizontalListSortingStrategy}
              >
                {board.lists.map((list) => (
                  <SortableBoardList key={"list_" + list.id} list={list} />
                ))}
              </SortableContext>

              <NewColumn board={board} />
            </div>
          </div>
          <DragOverlay>
            {activeList && (
              <BoardList
                list={activeList}
                className="[&>*:first-child]:cursor-grabbing"
              />
            )}
            {activeTask && (
              <TaskCard task={activeTask} className="cursor-grabbing" />
            )}
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

    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task as TaskWithSubtasks);
      return;
    }
  }

  function handleDragOver(event: DragOverEvent) {
    if (!board?.lists) return;

    const { active, over } = event;

    if (!over) return;
    if (active.id === over?.id) return;
    if (active.data.current?.type === "list") return;

    const activeTask = active.data.current?.task as TaskWithSubtasks;
    const activeList = board.lists.find(
      (list) => list.id === activeTask.listId
    );
    if (!activeList) return;

    const overTask = over.data.current?.task as TaskWithSubtasks | undefined;
    let overList = board.lists.find((list) => list.id === overTask?.listId);
    if (!overList)
      overList = over.data.current?.list as ListWithTasksAndSubtasks;
    if (!overList) return;

    if (activeList.id === overList.id) {
      const oldIndex = activeList.tasks.findIndex(
        (task) => task.id === activeTask.id
      );
      const newIndex = overTask?.id
        ? overList.tasks.findIndex((task) => task.id === overTask.id)
        : overList.tasks.length;

      const updatedTasks = arrayMove(activeList.tasks, oldIndex, newIndex);

      const newPosition = getItemNewPosition(
        newIndex,
        updatedTasks,
        "listPosition"
      );
      if (!newPosition) return;

      const updatedLists = board.lists.map((list) => {
        if (list.id === activeList.id)
          return {
            ...list,
            tasks: updatedTasks.map((task, i) => {
              if (i === newIndex) return { ...task, listPosition: newPosition };
              return task;
            }),
          };
        return list;
      });

      utils.boards.getById.setData(
        { boardId },
        {
          ...board,
          lists: updatedLists,
        }
      );
      return;
    }

    if (activeList.id !== overList.id) {
      const newList = overList;
      const oldList = activeList;

      const oldTaskIndex = oldList.tasks.findIndex(
        (task) => task.id === activeTask.id
      );
      const newTaskIndex = overTask?.id
        ? newList.tasks.findIndex((task) => task.id === overTask.id)
        : newList.tasks.length;

      const oldTasks = [...oldList.tasks];
      const newTasks = [...newList.tasks];
      const [removed] = oldTasks.splice(oldTaskIndex, 1);
      if (!removed) return;
      newTasks.splice(newTaskIndex, 0, removed);

      const newPosition = getItemNewPosition(
        newTaskIndex,
        newTasks,
        "listPosition"
      );
      if (!newPosition) return;

      const updatedLists = board.lists.map((list) => {
        if (list.id === oldList.id)
          return {
            ...list,
            tasks: oldTasks,
          };
        if (list.id === newList.id)
          return {
            ...list,
            tasks: newTasks.map((task, i) => {
              if (i === newTaskIndex)
                return {
                  ...task,
                  listPosition: newPosition,
                  listId: newList.id,
                };
              return task;
            }),
          };
        return list;
      });

      utils.boards.getById.setData(
        { boardId },
        { ...board, lists: updatedLists }
      );

      return;
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveList(null);
    setActiveTask(null);

    const { active, over } = event;

    if (active.id === over?.id) return;
    if (!board?.lists) return;
    if (active.data.current?.type === "task") return;

    const oldIndex = board.lists.findIndex(
      (list) => `list_${list.id}` === active.id
    );
    const newIndex = board.lists.findIndex(
      (list) => `list_${list.id}` === over?.id
    );
    const updatedLists = arrayMove(board.lists, oldIndex, newIndex);
    const currentList = updatedLists[newIndex];
    if (!currentList) return;

    const newPosition = getItemNewPosition(
      newIndex,
      updatedLists,
      "boardPosition"
    );
    if (!newPosition) return;

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
      listId: currentList.id,
      newPosition,
    });
  }

  function getItemNewPosition<T extends Record<PK, number>, PK extends keyof T>(
    newIndex: number,
    newItemsArray: T[],
    positionKey: PK
  ) {
    let newPosition: number;
    const maxPosition =
      Math.max(...newItemsArray.map((t) => t[positionKey])) + 10;
    const nextItem = newItemsArray[newIndex + 1];
    const prevItem = newItemsArray[newIndex - 1];

    if (newIndex === 0 && nextItem) {
      newPosition = nextItem[positionKey] / 2;
    } else if (newIndex === newItemsArray.length - 1) {
      newPosition = maxPosition + 10;
    } else {
      if (!nextItem || !prevItem) return;
      newPosition = (prevItem[positionKey] + nextItem[positionKey]) / 2;
    }

    return newPosition;
  }
}

BoardPage.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
