import { useRouter } from "next/router";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { type Dispatch, type SetStateAction, useState } from "react";
import { TaskDetail } from "./task-detail";
import type {
  BoardWithListsTasksSubtasks,
  TaskWithSubtasks,
} from "@/lib/types";
import { ThreeDotsMenu } from "./three-dots-menu";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { TaskForm } from "./task-form";

export function TaskModal({
  board,
  selectedTask,
  open,
  setOpen,
}: {
  board: BoardWithListsTasksSubtasks;
  selectedTask?: TaskWithSubtasks;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [editOn, setEditOn] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);

        if (!open) {
          setTimeout(() => {
            void router.push(
              {
                query: {
                  ...router.query,
                  taskId: undefined,
                },
              },
              undefined,
              {
                shallow: true,
              }
            );

            setEditOn(false);
          }, 300);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start justify-between">
            <h1 className="text-heading-l">
              {selectedTask
                ? editOn
                  ? "Edit Task"
                  : selectedTask.title
                : "Add New Task"}
            </h1>
            {selectedTask && (
              <ThreeDotsMenu menuTitle="Task menu">
                <DropdownMenuItem
                  onSelect={() => {
                    setEditOn(!editOn);
                  }}
                >
                  {editOn ? "View" : "Edit"}
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red">Delete</DropdownMenuItem>
              </ThreeDotsMenu>
            )}
          </div>
        </DialogHeader>

        {/* Edit mode is off, task selected */}
        {selectedTask && !editOn && (
          <TaskDetail boardLists={board.lists} task={selectedTask} />
        )}

        {/* Edit mode is on, task selected */}
        {selectedTask && editOn && (
          <TaskForm boardLists={board.lists} task={selectedTask} />
        )}

        {/* No task selected */}
        {!selectedTask && <TaskForm boardLists={board.lists} />}
      </DialogContent>
    </Dialog>
  );
}
