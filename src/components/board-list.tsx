import type { ListWithTasksAndSubtasks } from "@/lib/types";
import TaskCard from "./task-card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function BoardList({
  list,
}: {
  list: ListWithTasksAndSubtasks;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: list.id,
      // animateLayoutChanges: () => false,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-[17.5rem] transition-none"
    >
      {/* List Header */}
      <div {...listeners} className="flex items-center gap-3">
        <div
          style={{ backgroundColor: list.colorCode }}
          className="h-[15px] w-[15px] rounded-full bg-slate-600"
        />
        <h2 className="text-heading-s uppercase text-medium-grey">
          {list.name} ({list?.tasks?.length || 0})
        </h2>
      </div>
      {/* List items */}
      <div className="mt-6 flex flex-col gap-5">
        {list.tasks?.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
