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
  type InsertTask,
  insertTaskSchema,
  type TaskWithSubtasks,
  type List,
} from "@/lib/types";

export function TaskForm({
  task,
  boardLists,
}: {
  task?: TaskWithSubtasks;
  boardLists: Pick<List, "id" | "name">[];
}) {
  // rename subtask id to subtaskId, because rhf overrides id
  if (task?.subtasks) {
    task.subtasks = task.subtasks.map((subtask) => ({
      ...subtask,
      subtaskId: subtask.id,
    }));
  }

  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      id: task?.id,
      listId: task?.listId,
      title: task?.title ?? "",
      description: task?.description ?? "",
      subtasks: task?.subtasks ?? [
        {
          title: "",
          isCompleted: false,
        },
        {
          title: "",
          isCompleted: false,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  function onSubmit(data: InsertTask) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {task?.id && <input type="hidden" {...form.register("id")} />}
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
            {fields.map((field, index) => (
              <div key={field.id}>
                {field.subtaskId && (
                  <input
                    type="hidden"
                    {...form.register(`subtasks.${index}.subtaskId`)}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`subtasks.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <Input
                            placeholder="e.g. Take coffee break"
                            {...field}
                          />
                          <DeleteItemButton
                            type="button"
                            className="hover:fill-red"
                            onClick={() => remove(index)}
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

        <Button btnType="primary" size="S" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
