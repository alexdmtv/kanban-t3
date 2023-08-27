import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const insertListSchema = z.object({
  name: z.string().nonempty("List name can't be empty"),
  colorCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: "Invalid color code",
  }),
  boardPosition: z.number(),
  boardId: z.number().int().gt(0).optional(),
});

export const insertBoardSchema = z.object({
  name: z.string().nonempty("Board name can't be empty"),
  lists: z.array(insertListSchema),
});
export type InsertBoard = z.infer<typeof insertBoardSchema>;

export const updateListSchema = insertListSchema.merge(
  z.object({
    id: z.number().int().gt(0),
    delete: z.boolean().optional(),
  })
);
export type UpdateList = z.infer<typeof updateListSchema>;

export const updateBoardSchema = insertBoardSchema.merge(
  z.object({
    id: z.number().int().gt(0),
    lists: z.array(
      updateListSchema.merge(
        z.object({
          id: z.coerce.number().int().optional(),
        })
      )
    ),
  })
);
export type UpdateBoard = z.infer<typeof updateBoardSchema>;

export const insertSubtaskSchema = z.object({
  title: z
    .string()
    .nonempty("Subtask title can't be empty")
    .max(256, "Subtask title can't be longer than 256 characters"),
  taskId: z.coerce.number().int().gt(0).optional(),
  isCompleted: z.boolean().optional(),
  taskPosition: z.number(),
});
export type InsertSubtask = z.infer<typeof insertSubtaskSchema>;

export const updateSubtaskSchema = insertSubtaskSchema.merge(
  z.object({
    id: z.coerce.number().int().gt(0),
    delete: z.boolean().optional(),
  })
);
export type UpdateSubtask = z.infer<typeof updateSubtaskSchema>;

export const insertTaskSchema = z.object({
  title: z
    .string()
    .nonempty("Task title can't be empty")
    .max(256, "Task title can't be longer than 256 characters"),
  description: z
    .string()
    .max(3000, "Description can't be longer than 3000 characters")
    .default(""),
  listId: z.coerce.number().int(),
  subtasks: z.array(insertSubtaskSchema),
});
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const updateTaskSchema = insertTaskSchema.merge(
  z.object({
    id: z.coerce.number().int().gt(0),
    subtasks: z.array(
      updateSubtaskSchema.merge(
        z.object({ id: z.coerce.number().int().gt(0).optional() })
      )
    ),
  })
);
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export type TaskWithSubtasks = Prisma.TaskGetPayload<{
  include: { subtasks: true };
}>;
export type BoardWithListsTasksSubtasks = Prisma.BoardGetPayload<{
  include: {
    lists: {
      include: {
        tasks: {
          include: {
            subtasks: true;
          };
        };
      };
    };
  };
}>;
export type BoardWithLists = Prisma.BoardGetPayload<{
  include: { lists: true };
}>;
export type List = Prisma.ListGetPayload<true>;
export type ListWithTasksAndSubtasks = Prisma.ListGetPayload<{
  include: {
    tasks: {
      include: {
        subtasks: true;
      };
    };
  };
}>;
