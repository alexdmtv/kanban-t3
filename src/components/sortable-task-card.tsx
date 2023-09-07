import type { TaskWithSubtasks } from "@/lib/types";
import TaskCard from "./task-card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function SortableTaskCard({ task }: { task: TaskWithSubtasks }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `task_${task.id}`,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TaskCard
      task={task}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn({
        "select-none border-2 border-main-purple bg-dark-grey/10 [&>*]:opacity-0":
          isDragging,
      })}
    />
  );
}
