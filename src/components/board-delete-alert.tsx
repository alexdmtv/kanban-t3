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
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import { toast } from "./ui/use-toast";

export function BoardDeleteAlert({
  board,
  onOpenChange,
  open,
}: {
  open: boolean;
  board: { id: number; name: string; [key: string]: unknown };
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const utils = api.useContext();
  const deleteBoardMutation = api.boards.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: `Board "${board.name}" deleted`,
      });
      await router.push("/boards");
    },

    onError: async () => {
      toast({
        title: `Error deleting the "${board.name}" board.`,
        variant: "destructive",
      });
      await utils.boards.getById.invalidate({ boardId: board.id });
    },
  });

  const handleDelete = () => {
    deleteBoardMutation.mutate({ boardId: board.id });
  };

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
            <Button btnType="destructive" size="S" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
