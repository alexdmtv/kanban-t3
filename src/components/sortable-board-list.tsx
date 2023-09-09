import type { ListWithTasksAndSubtasks } from "@/lib/types";
import BoardList from "./board-list";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function SortableBoardList({
  list,
  className,
}: {
  list: ListWithTasksAndSubtasks;
  className?: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `list_${list.id}`,
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
      className={cn(
        {
          "rounded-md bg-dark-grey/10 outline-dashed outline-2 outline-main-purple-hover/60 [&>*]:opacity-0":
            isDragging,
        },
        className
      )}
    />
  );
}
