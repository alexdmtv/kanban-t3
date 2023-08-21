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
import { type BoardWithLists, updateBoardSchema } from "@/lib/types";
import { z } from "zod";
import { cn } from "@/lib/utils";

export function BoardForm({ board }: { board?: BoardWithLists }) {
  const schema = updateBoardSchema.merge(
    z.object({
      id: z.coerce.number().gt(0).optional(),
    })
  );
  type FormType = z.infer<typeof schema>;
  const defaultValues = board?.id
    ? board
    : {
        name: "",
        lists: [
          {
            name: "Todo",
            colorCode: "#635FC7",
            boardPosition: 0,
          },
          {
            name: "Done",
            colorCode: "#635FC7",
            boardPosition: 1,
          },
        ],
      };

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, update, remove } = useFieldArray({
    control: form.control,
    name: "lists",
    keyName: "keyId",
  });

  function onSubmit(data: FormType) {
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
            {fields.map((item, index) => (
              <div key={item.keyId}>
                <FormField
                  control={form.control}
                  name={`lists.${index}.name`}
                  render={({ field }) => (
                    <FormItem className={cn("", { hidden: item.delete })}>
                      <FormControl>
                        <div className="flex items-center">
                          <Input placeholder="e.g. Todo" {...field} />
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
                name: "",
                colorCode: "#635FC7",
                boardPosition: fields.length,
                boardId: board?.id,
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
