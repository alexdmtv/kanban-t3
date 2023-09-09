import type { List, TaskWithSubtasks } from "@/lib/types";
import debounce from "lodash.debounce";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { toast } from "./ui/use-toast";
import { useCallback, useEffect, useRef } from "react";

export function TaskDetail({
  task,
  boardLists,
}: {
  task: TaskWithSubtasks;
  boardLists: Pick<List, "id" | "name">[];
}) {
  const router = useRouter();
  const utils = api.useContext();

  const debouncedInvalidateRef = useRef<(() => void) | null>(null);
  if (!debouncedInvalidateRef.current) {
    debouncedInvalidateRef.current = debounce(async () => {
      await utils.boards.getById.invalidate({
        boardId: +router.query.boardId!,
      });
    }, 5000) as () => void;
  }

  const updateTaskMutation = api.tasks.update.useMutation({
    onMutate: (newTask) => {
      void utils.boards.getById.cancel({ boardId: +router.query.boardId! });

      const oldBoard = utils.boards.getById.getData({
        boardId: +router.query.boardId!,
      })!;

      const minPositionInANewList = Math.min(
        ...oldBoard.lists
          .filter((list) => {
            return list.id === +newTask.listId;
          })
          .flatMap((list) => list.tasks)
          .map((task) => task.listPosition)
      );

      newTask = {
        ...newTask,
        listId: +newTask.listId,
        listPosition:
          +task.listId !== +newTask.listId
            ? minPositionInANewList / 2
            : newTask.listPosition,
      };

      const newBoard = {
        ...oldBoard,
        lists: oldBoard.lists.map((list) => {
          if (list.id === newTask.listId && newTask.listId !== task.listId) {
            return {
              ...list,
              tasks: [...list.tasks, newTask],
            };
          } else if (
            list.id === task.listId &&
            newTask.listId !== task.listId
          ) {
            return {
              ...list,
              tasks: list.tasks.filter((t) => t.id !== task.id),
            };
          } else if (
            list.id === task.listId &&
            newTask.listId === task.listId
          ) {
            return {
              ...list,
              tasks: list.tasks.map((t) => {
                if (t.id === task.id) {
                  return newTask;
                } else {
                  return t;
                }
              }),
            };
          } else {
            return list;
          }
        }),
      } as typeof oldBoard;

      utils.boards.getById.setData(
        { boardId: +router.query.boardId! },
        newBoard
      );

      return { oldBoard };
    },
    onSuccess: (data) => {
      toast({
        title: `Task "${data.title}" was updated`,
        variant: "default",
      });
    },
    onError: (err, newTask, ctx) => {
      const oldBoard = ctx?.oldBoard;
      if (oldBoard) {
        utils.boards.getById.setData(
          { boardId: +router.query.boardId! },
          oldBoard
        );
      }

      toast({
        title: "An error occurred.",
        variant: "destructive",
      });
    },

    onSettled: () => {
      debouncedInvalidateRef.current?.();
    },
  });

  const form = useForm<TaskWithSubtasks>({
    defaultValues: task,
  });
  const { fields } = useFieldArray({
    name: "subtasks",
    control: form.control,
  });

  const onSubmit = useCallback(
    (data: TaskWithSubtasks) => updateTaskMutation.mutate(data),
    [updateTaskMutation]
  );

  useEffect(() => {
    const subscription = form.watch(() => void form.handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [form, onSubmit]);

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.isCompleted).length || 0;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="min-w-full space-y-6"
      >
        <p className="min-h-[6rem] text-body-l text-medium-grey">
          {task.description}
        </p>
        <div>
          <h3 className="mb-4 text-body-m text-medium-grey dark:text-white">
            Subtasks ({completedSubtasks} of {totalSubtasks})
          </h3>

          <div className="space-y-2">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "group flex items-center gap-4 rounded bg-light-grey px-3 py-3 hover:!bg-main-purple/25 dark:bg-very-dark-grey"
                )}
              >
                <FormField
                  control={form.control}
                  name={`subtasks.${index}.isCompleted`}
                  render={({ field }) => (
                    <FormItem className="flex items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            // void form.trigger();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p
                  className={cn("text-body-m", {
                    "text-medium-grey line-through": form.watch(
                      `subtasks.${index}.isCompleted`
                    ),
                  })}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="listId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current List</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select list" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {boardLists.map(({ id, name }) => (
                    <SelectItem key={id} value={id?.toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
