import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Button from "./button";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/router";
import { useTaskModal } from "@/lib/store";
import { removeQueryKeyFromUrl } from "@/lib/utils";
import { api } from "@/utils/api";

export function TaskDeleteAlert({
  task,
  onOpenChange,
  open,
}: {
  open: boolean;
  task: { id: number; title: string; [key: string]: unknown };
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { closeTaskModal } = useTaskModal();
  const utils = api.useContext();
  const deleteTaskMutation = api.tasks.delete.useMutation({
    onSuccess: () => {
      void utils.boards.getById.invalidate({ boardId: +router.query.boardId! });
      toast({
        title: `Task "${task.title}" was deleted`,
      });
      closeTaskModal();
    },

    onError: () => {
      toast({
        title: "Error",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteTaskMutation.mutate(task.id);
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-heading-l text-red">
            Delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the &quot;{task.title}&quot; task
            and its subtasks? This action cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Button btnType="secondary" size="S">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction>
            <Button btnType="destructive" size="S" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
