import type { Prisma } from "@prisma/client";

type TaskWithSubtasks = Prisma.tasksGetPayload<{
  include: {
    subtasks: true;
  };
}>;

export default function TaskCard({ task }: { task: TaskWithSubtasks }) {
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.is_completed).length || 0;

  return (
    <div className="rounded-lg bg-white px-4 py-6 shadow-md dark:bg-dark-grey">
      <h3 className="text-heading-m">{task.name}</h3>
      <p className="mt-2 text-body-m text-medium-grey">
        {completedSubtasks} of {totalSubtasks} subtasks
      </p>
    </div>
  );
}
