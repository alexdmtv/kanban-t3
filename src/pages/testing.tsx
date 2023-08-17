import { TaskDetail } from "@/components/task-detail";

export default function TestingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-[30rem] bg-light-grey p-6 dark:bg-dark-grey">
        <TaskDetail
          task={{
            id: 1,
            taskId: 1,
            title: "Task 1",
            description:
              "Mollit dolore voluptate non eiusmod et et nostrud exercitation eu sunt fugiat anim quis dolore labore. Qui minim occaecat eiusmod officia labore occaecat laboris. Aliquip ullamco commodo pariatur id et enim dolore. Aute occaecat enim ipsum. Commodo ad enim laboris anim nulla amet ea eu fugiat Lorem qui nostrud occaecat et. In incididunt elit consectetur fugiat pariatur commodo dolore aliquip veniam occaecat aliqua reprehenderit excepteur dolor. Tempor do aliqua labore cupidatat laborum.",
            createdAt: new Date(),
            updatedAt: new Date(),
            listId: 1,
            listPosition: 1,
            subtasks: [
              {
                id: 1,
                title: "Subtask 1",
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                taskId: 1,
                taskPosition: 1,
              },
              {
                id: 2,
                title: "Subtask 2",
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                taskId: 1,
                taskPosition: 2,
              },
            ],
          }}
          boardLists={[
            {
              id: 1,
              name: "To Do",
            },
            {
              id: 2,
              name: "In Progress",
            },
            {
              id: 3,
              name: "Done",
            },
          ]}
        />
      </div>
    </div>
  );
}
