import type { ListWithTasksAndSubtasks } from "@/lib/types";
import { type ComponentPropsWithoutRef, forwardRef, useMemo } from "react";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { type DraggableAttributes } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import SortableTaskCard from "./sortable-task-card";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type BoardListProps = {
  list: ListWithTasksAndSubtasks;
} & ComponentPropsWithoutRef<"div"> & {
    listeners?: SyntheticListenerMap;
    attributes?: DraggableAttributes;
  };

const BoardList = forwardRef<HTMLDivElement, BoardListProps>(
  ({ list, listeners, attributes, className, ...props }, ref) => {
    const taskIds = useMemo(
      () => list.tasks.map((t) => "task_" + t.id),
      [list]
    );
    return (
      <div {...props} ref={ref} className={cn("w-[17.5rem]", className)}>
        {/* List Header */}
        <div
          {...listeners}
          {...attributes}
          className="flex cursor-grab items-center gap-3 active:cursor-grabbing"
        >
          <div
            style={{ backgroundColor: list.colorCode }}
            className="h-[15px] w-[15px] rounded-full bg-slate-600"
          />
          <h2 className="text-heading-s uppercase text-medium-grey">
            {list.name} ({list?.tasks?.length || 0})
          </h2>
        </div>
        {/* List items */}
        <div className="mt-6 space-y-5">
          <SortableContext
            strategy={verticalListSortingStrategy}
            items={taskIds}
          >
            {list.tasks?.map((task) => (
              <SortableTaskCard key={"task_" + task.id} task={task} />
            ))}
          </SortableContext>
        </div>
      </div>
    );
  }
);

BoardList.displayName = "BoardList";

export default BoardList;
