import type { TaskWithSubtasks } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import DragHandle from "./drag-handle";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { type DraggableAttributes } from "@dnd-kit/core";

type TaskCardProps = {
  task: TaskWithSubtasks;
} & ComponentPropsWithoutRef<"div"> & {
    listeners?: SyntheticListenerMap;
    attributes?: DraggableAttributes;
  };

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, listeners, attributes, className, ...props }, ref) => {
    const router = useRouter();

    const totalSubtasks = task.subtasks?.length || 0;
    const completedSubtasks =
      task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0;

    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          "rounded-lg bg-white px-4 py-6 shadow-md dark:bg-dark-grey",
          className
        )}
      >
        <div className="flex items-start justify-between gap-x-2">
          <Link
            href={{
              query: {
                boardId: router.query.boardId,
                taskId: task.id.toString(),
              },
            }}
            shallow={true}
          >
            <h3 className="text-heading-m hover:text-main-purple">
              {task.title}
            </h3>
          </Link>

          <DragHandle {...listeners} {...attributes} />
        </div>

        <p className="mt-2 text-body-m text-medium-grey">
          {completedSubtasks} of {totalSubtasks} subtasks
        </p>
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
