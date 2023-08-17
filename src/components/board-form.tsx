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
import DeleteItemButton from "./delete-item-button";
import {
  type BoardWithLists,
  insertBoardSchema,
  type InsertBoard,
} from "@/lib/types";

export function BoardForm({ board }: { board?: BoardWithLists }) {
  // rename list id to listId, because rhf overrides id
  if (board?.lists) {
    board.lists = board.lists.map((list) => ({
      ...list,
      listId: list.id,
    }));
  }

  const form = useForm<InsertBoard>({
    resolver: zodResolver(insertBoardSchema),
    defaultValues: {
      id: board?.id,
      name: board?.name ?? "",
      lists: board?.lists ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lists",
  });

  function onSubmit(data: InsertBoard) {
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
        {board?.id && <input type="hidden" {...form.register("id")} />}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Board Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Web Design" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p className="mb-2 text-body-m text-medium-grey">Board Lists</p>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id}>
                {field.listId && (
                  <input
                    type="hidden"
                    {...form.register(`lists.${index}.listId`)}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`lists.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <Input placeholder="e.g. Todo" {...field} />
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
                name: "",
                boardPosition: 0,
                colorCode: "blue",
              });
            }}
          >
            + Add New List
          </Button>
        </div>

        <Button btnType="primary" size="S" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
