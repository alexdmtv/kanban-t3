import TaskCard from "./task-card";
import type { Prisma } from "@prisma/client";

type ListWithTasksAndSubtasks = Prisma.ListGetPayload<{
  include: {
    tasks: {
      include: {
        subtasks: true;
      };
    };
  };
}>;

export default function BoardList({
  list,
}: {
  list: ListWithTasksAndSubtasks;
}) {
  return (
    <div className="w-[17.5rem]">
      {/* List Header */}
      <div className="flex items-center gap-3">
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
