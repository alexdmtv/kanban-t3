import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";

import Button from "@/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "./ui/textarea";
import DeleteItemButton from "./delete-item-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  type TaskWithSubtasks,
  type List,
  updateTaskSchema,
} from "@/lib/types";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useTaskModal } from "@/lib/store";

const subtaskPlaceholders = [
  "e.g. Make coffee",
  "e.g. Drink coffee & smile",
  "e.g. Take a walk",
];

export function TaskForm({
  task,
  boardLists,
}: {
  task?: TaskWithSubtasks;
  boardLists: Pick<List, "id" | "name">[];
}) {
  const router = useRouter();
  const { boardId } = router.query;
  const { closeTaskModal } = useTaskModal();

  const utils = api.useContext();
  const createTaskMutation = api.tasks.create.useMutation({
    onSuccess: (data) => {
      void utils.boards.getById.invalidate({ boardId: +boardId! });
      toast({
        title: `Task "${data.title}" was created`,
      });
      closeTaskModal();
    },
    onError: () => {
      toast({
        title: "An error occurred.",
        variant: "destructive",
      });
    },
  });
  const updateTaskMutation = api.tasks.update.useMutation({
    onSuccess: (data) => {
      void utils.boards.getById.invalidate({ boardId: +boardId! });
      toast({
        title: `Task "${data.title}" was updated`,
      });
      closeTaskModal();
    },
    onError: () => {
      toast({
        title: "An error occurred.",
        variant: "destructive",
      });
    },
  });

  const firstListId = boardLists.at(0)?.id;
  const schema = updateTaskSchema.merge(
    z.object({
      id: z.coerce.number().gt(0).optional(),
    })
  );
  type FormType = z.infer<typeof schema>;
  const defaultValues = task?.id
    ? task
    : {
        title: "",
        description: "",
        listId: firstListId,
        subtasks: [
          {
            title: "",
            isCompleted: false,
            taskPosition: 1,
          },
          {
            title: "",
            isCompleted: false,
            taskPosition: 2,
          },
        ],
      };

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "subtasks",
    keyName: "keyId",
  });

  function onSubmit(data: FormType) {
    if (!data?.id) {
      createTaskMutation.mutate(data);
    } else {
      const { id, ...rest } = data;
      updateTaskMutation.mutate({ id, ...rest });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Take coffee break" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. It’s always good to take a break. This 15 minute break will 
recharge the batteries a little."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p className="mb-2 text-body-m text-medium-grey">Subtasks</p>
          <div className="space-y-3">
            {fields.map((item, index) => (
              <div key={item.keyId}>
                <FormField
                  control={form.control}
                  name={`subtasks.${index}.title`}
                  render={({ field }) => (
                    <FormItem className={cn("", { hidden: item.delete })}>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            placeholder={
                              subtaskPlaceholders.at(index) ??
                              "Subtask title..."
                            }
                            {...field}
                          />
                          <DeleteItemButton
                            tabIndex={-1}
                            type="button"
                            className="hover:fill-red"
                            onClick={() => {
                              if (!item.id) {
                                remove(index);
                                return;
                              }

                              update(index, {
                                ...item,
                                delete: true,
                              });
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
          <Button
            type="button"
            btnType="secondary"
            size="S"
            className="mt-3"
            onClick={() => {
              append({
                title: "",
                isCompleted: false,
                taskPosition:
                  Math.max(...fields.map((s) => s.taskPosition)) + 10,
                taskId: task?.id,
              });
            }}
          >
            + Add New Subtask
          </Button>
        </div>

        <FormField
          control={form.control}
          name="listId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>List</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={boardLists.at(0)?.id?.toString()}
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

        <Button btnType="primary" size="S" type="submit">
          {task?.id ? "Save" : "Add Task"}
        </Button>
      </form>
    </Form>
  );
}
