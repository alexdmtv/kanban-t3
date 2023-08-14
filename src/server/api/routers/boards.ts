import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const boardsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findMany({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),

  getFirstCreated: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.board.findFirst({
      where: {
        ownerId: ctx.auth.userId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 1,
    });
  }),

  getById: protectedProcedure
    .input(
      z.object({
        boardId: z.number().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.board.findFirst({
        where: {
          id: input.boardId,
          ownerId: ctx.auth.userId,
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
