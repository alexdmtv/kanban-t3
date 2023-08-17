import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

type TaskWithSubtasks = Prisma.TaskGetPayload<{
  include: {
    subtasks: true;
  };
}>;

export default function TaskCard({ task }: { task: TaskWithSubtasks }) {
  const router = useRouter();

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0;

  return (
    <Link
      href={{
        query: { boardId: router.query.boardId, taskId: task.id.toString() },
      }}
      shallow={true}
    >
      <div className="group rounded-lg bg-white px-4 py-6 shadow-md hover:cursor-pointer dark:bg-dark-grey">
        <h3 className="text-heading-m group-hover:text-main-purple">
          {task.title}
        </h3>
        <p className="mt-2 text-body-m text-medium-grey">
          {completedSubtasks} of {totalSubtasks} subtasks
        </p>
      </div>
    </Link>
  );
}
