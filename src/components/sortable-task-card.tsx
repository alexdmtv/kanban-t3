import type { TaskWithSubtasks } from "@/lib/types";
import TaskCard from "./task-card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function SortableTaskCard({
  task,
  className,
}: {
  task: TaskWithSubtasks;
  className?: string;
}) {
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
    animateLayoutChanges: () => true,
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
      className={cn(
        {
          "border-2 border-main-purple bg-dark-grey/10 transition-transform duration-300 [&>*]:opacity-0":
            isDragging,
        },
        className
      )}
    />
  );
}
