import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const boardsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.boards.findMany({
      where: {
        owner_id: ctx.auth.userId,
      },
    });
  }),

  getFirstCreated: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.boards.findFirst({
      where: {
        owner_id: ctx.auth.userId,
      },
      orderBy: {
        created_at: "asc",
      },
      take: 1,
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        board_id: z.number().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.boards.findFirst({
        where: {
          id: input.board_id,
          owner_id: ctx.auth.userId,
        },
        include: {
          lists: {
            include: {
              tasks: {
                include: {
                  subtasks: true,
                },
              },
            },
          },
        },
      });
    }),
});
