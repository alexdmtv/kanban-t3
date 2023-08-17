import type { Prisma } from "@prisma/client";
import { z } from "zod";

export const insertListSchema = z.object({
  listId: z.number().int().gt(0).optional(),
  name: z.string().min(1, {
    message: "List name must be at least 1 character long",
  }),
  colorCode: z.string(),
  boardPosition: z.number(),
  boardId: z.number().optional(),
});

export const insertBoardSchema = z.object({
  id: z.number().int().gt(0).optional(),
  name: z.string().min(1, {
    message: "Board name must be at least 1 character long",
  }),
  lists: z.array(insertListSchema),
});

export type InsertBoard = z.infer<typeof insertBoardSchema>;

export type BoardWithLists = Prisma.BoardGetPayload<{
  include: { lists: true };
}>;

export const insertTaskSchema = z.object({
  id: z.number().int().gt(0).optional(),
  title: z
    .string()
    .nonempty("Task title can't be empty")
    .max(256, "Task title can't be longer than 256 characters"),
  description: z
    .string()
    .max(3000, "Description can't be longer than 3000 characters"),
  listId: z.coerce.number().int(),
  subtasks: z.array(
    z.object({
      subtaskId: z.coerce.number().int().gt(0).optional(),
      title: z
        .string()
        .nonempty("Subtask title can't be empty")
        .max(256, "Subtask title can't be longer than 256 characters"),
      isCompleted: z.boolean(),
    })
  ),
});

export const updateTaskSchema = insertTaskSchema.merge(
  z.object({
    id: z.number().int().gt(0),
    subtasks: z.array(
      z.object({
        subtaskId: z.coerce.number().int().gt(0).optional(),
      })
    ),
  })
);

export type UpdateTask = z.infer<typeof updateTaskSchema>;

export type InsertTask = z.infer<typeof insertTaskSchema>;

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

export type List = Prisma.ListGetPayload<true>;
