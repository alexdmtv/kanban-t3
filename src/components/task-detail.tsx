import type { List, TaskWithSubtasks } from "@/lib/types";
import { ThreeDotsMenu } from "./three-dots-menu";
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
import { DropdownMenuItem } from "./ui/dropdown-menu";

export function TaskDetail({
  task,
  boardLists,
}: {
  task: TaskWithSubtasks;
  boardLists: Pick<List, "id" | "name">[];
}) {
  const form = useForm<TaskWithSubtasks>({
    defaultValues: task,
  });
  const { fields } = useFieldArray({
    name: "subtasks",
    control: form.control,
  });

  function onSubmit(data: TaskWithSubtasks) {
    console.log(data);
  }

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
                  "group flex items-center gap-4 rounded bg-light-grey px-3 py-3 dark:bg-very-dark-grey"
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
