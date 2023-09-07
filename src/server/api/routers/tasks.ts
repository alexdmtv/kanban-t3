import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  reorder: protectedProcedure
    .input(
      z.object({
        taskId: z.number().min(1),
        newListId: z.number().min(1),
        newPosition: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.task.update({
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
});
