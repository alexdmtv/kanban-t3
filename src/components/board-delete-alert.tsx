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

export function BoardDeleteAlert({
  board,
  onOpenChange,
  open,
}: {
  open: boolean;
  board: { id: number; name: string; [key: string]: unknown };
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-heading-l text-red">
            Delete this board?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the &quot;{board.name}&quot; board?
            This action will remove all columns and tasks and cannot be
            reversed.
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
