import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertTaskSchema, updateTaskSchema } from "@/lib/types";

export const tasksRouter = createTRPCRouter({
  reorder: protectedProcedure
    .input(
      z.object({
        taskId: z.number().min(1),
        newListId: z.number().min(1),
        newPosition: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.task.update({
        where: {
          id: input.taskId,
          list: {
            board: {
              ownerId: ctx.auth.userId,
            },
          },
        },
        data: {
          listId: input.newListId,
          listPosition: input.newPosition,
        },
      });
    }),

  create: protectedProcedure
    .input(insertTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const minPosition = (
        await ctx.prisma.task.findFirst({
          where: {
            listId: input.listId,
          },
          orderBy: {
            listPosition: "asc",
          },
          select: {
            listPosition: true,
          },
        })
      )?.listPosition;

      return await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          list: {
            connect: {
              id: input.listId,
              AND: {
                board: {
                  ownerId: ctx.auth.userId,
                },
              },
            },
          },
          listPosition: minPosition ? minPosition / 2 : 1,
          subtasks: {
            create: input.subtasks,
          },
        },
      });
    }),

  update: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { subtasks, ...task } = input;

      subtasks.forEach((subtask) => {
        delete subtask.taskId;
      });

      const subtasksToCreate = subtasks.filter((subtask) => !subtask.id);
      const subtasksToUpdate = subtasks.filter(
        (subtask) => subtask.id && !subtask.delete
      );
      const subtasksToDelete = subtasks.filter((subtask) => subtask.delete);

      return await ctx.prisma.$transaction(async (tx) => {
        let taskPosition: number | undefined;

        const currentListId = (
          await tx.task.findFirst({
            where: {
              id: task.id,
              list: {
                board: {
                  ownerId: ctx.auth.userId,
                },
              },
            },
            select: {
              listId: true,
            },
          })
        )?.listId;

        if (currentListId !== task.listId) {
          taskPosition = (
            await tx.task.findFirst({
              where: {
                listId: task.listId,
              },
              orderBy: {
                listPosition: "asc",
              },
              select: {
                listPosition: true,
              },
            })
          )?.listPosition;
          taskPosition = taskPosition ? taskPosition / 2 : 1;
        } else {
          taskPosition = task.listPosition;
        }

        return await tx.task.update({
          where: {
            id: task.id,
            list: {
              board: {
                ownerId: ctx.auth.userId,
              },
            },
          },
          data: {
            ...task,
            listPosition: taskPosition,
            subtasks: {
              create: subtasksToCreate,
              updateMany: subtasksToUpdate.map(({ id, ...subtask }) => ({
                where: {
                  id,
                },
                data: subtask,
              })),
              deleteMany: subtasksToDelete.map(({ id }) => ({
                id,
              })),
            },
          },
        });
      });
    }),

  delete: protectedProcedure
    .input(z.number().int().gt(0))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.task.delete({
        where: {
          id: input,
          list: {
            board: {
              ownerId: ctx.auth.userId,
            },
          },
        },
      });
    }),
});
