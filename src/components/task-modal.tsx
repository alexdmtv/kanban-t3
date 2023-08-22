import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { useState } from "react";
import { TaskDetail } from "./task-detail";
import { ThreeDotsMenu } from "./three-dots-menu";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { TaskForm } from "./task-form";
import { TaskDeleteAlert } from "./task-delete-alert";
import { useTaskModal } from "@/lib/store";
import { useRouter } from "next/router";
import { removeQueryKeyFromUrl } from "@/lib/utils";

export function TaskModal() {
  const router = useRouter();

  const { closeTaskModal, taskModalData, taskModalOpen } = useTaskModal();

  const [editMode, setEditMode] = useState(false);
  const [taskDeleteAlertOpen, setTaskDeleteAlertOpen] = useState(false);

  if (!taskModalData) {
    return null;
  }
  const { taskBoard: board, selectedTask } = taskModalData;

  return (
    <Dialog
      open={taskModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeTaskModal();

          setTimeout(() => {
            if (router.query.taskId) removeQueryKeyFromUrl(router, "taskId");
            setEditMode(false);
          }, 300);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start justify-between">
            <h1 className="text-heading-l">
              {selectedTask
                ? editMode
                  ? "Edit Task"
                  : selectedTask.title
                : "Add New Task"}
            </h1>
            {selectedTask && (
              <ThreeDotsMenu menuTitle="Task menu">
                <DropdownMenuItem
                  onSelect={() => {
                    setEditMode(!editMode);
                  }}
                >
                  {editMode ? "View" : "Edit"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setTaskDeleteAlertOpen(true);
                  }}
                  className="text-red"
                >
                  Delete
                </DropdownMenuItem>
              </ThreeDotsMenu>
            )}

            {selectedTask && (
              <TaskDeleteAlert
                task={selectedTask}
                open={taskDeleteAlertOpen}
                onOpenChange={(open) => {
                  setTaskDeleteAlertOpen(open);
                }}
              />
            )}
          </div>
        </DialogHeader>

        {/* Edit mode is off, task selected */}
        {selectedTask && !editMode && (
          <TaskDetail boardLists={board.lists} task={selectedTask} />
        )}

        {/* Edit mode is on, task selected */}
        {selectedTask && editMode && (
          <TaskForm boardLists={board.lists} task={selectedTask} />
        )}

        {/* No task selected */}
        {!selectedTask && <TaskForm boardLists={board.lists} />}
      </DialogContent>
    </Dialog>
  );
}
