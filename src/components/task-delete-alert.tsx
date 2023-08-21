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

export function TaskDeleteAlert({
  task,
  onOpenChange,
  open,
}: {
  open: boolean;
  task: { id: number; title: string; [key: string]: unknown };
  onOpenChange: (open: boolean) => void;
}) {
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
            <Button btnType="destructive" size="S">
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
