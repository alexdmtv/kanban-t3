import type { ListWithTasksAndSubtasks } from "@/lib/types";
import BoardList from "./board-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function SortableBoardList({
  list,
}: {
  list: ListWithTasksAndSubtasks;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: "list",
      list,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <BoardList
      list={list}
      attributes={attributes}
      listeners={listeners}
      ref={setNodeRef}
      style={style}
      className={cn({
        "select-none rounded-md border-2 border-main-purple bg-dark-grey/10 [&>*]:opacity-0":
          isDragging,
      })}
    />
  );
}
