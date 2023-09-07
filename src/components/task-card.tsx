import type { TaskWithSubtasks } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

type TaskCardProps = {
  task: TaskWithSubtasks;
} & ComponentPropsWithoutRef<"div">;

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, className, ...props }, ref) => {
    const router = useRouter();

    const totalSubtasks = task.subtasks?.length || 0;
    const completedSubtasks =
      task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0;

    return (
      <div
        {...props}
        ref={ref}
        className={cn(
          "cursor-grab rounded-lg bg-white px-4 py-6 shadow-md active:cursor-grabbing dark:bg-dark-grey",
          className
        )}
      >
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

        <p className="mt-2 text-body-m text-medium-grey">
          {completedSubtasks} of {totalSubtasks} subtasks
        </p>
      </div>
    );
  }
);

TaskCard.displayName = "TaskCard";

export default TaskCard;
