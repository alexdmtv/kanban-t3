import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const listsRouter = createTRPCRouter({
  reorder: protectedProcedure
    .input(
      z.object({
        listId: z.number().min(1),
        newPosition: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      console.log("reorder", input);

      return ctx.prisma.list.update({
        where: {
          id: input.listId,
          board: {
            ownerId: ctx.auth.userId,
          },
        },
        data: {
          boardPosition: input.newPosition,
        },
      });
    }),
});
