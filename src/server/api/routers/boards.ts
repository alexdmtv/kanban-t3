import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertBoardSchema, updateBoardSchema } from "@/lib/types";

export const boardsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.board.findMany({
      where: {
        ownerId: ctx.auth.userId,
      },
    });
  }),

  getFirstCreated: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.board.findFirst({
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
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.board.findFirst({
        where: {
          id: input.boardId,
          ownerId: ctx.auth.userId,
        },
        include: {
          lists: {
            orderBy: {
              boardPosition: "asc",
            },
            include: {
              tasks: {
                orderBy: {
                  listPosition: "asc",
                },
                include: {
                  subtasks: {
                    orderBy: {
                      taskPosition: "asc",
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(insertBoardSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.board.create({
        data: {
          ...input,
          lists: {
            create: input.lists,
          },
          ownerId: ctx.auth.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(updateBoardSchema)
    .mutation(async ({ ctx, input }) => {
      const { lists, ...board } = input;

      const listsToCreate = lists.filter((list) => !list.id);
      const listsToUpdate = lists.filter((list) => list.id);
      const listsToDelete = lists.filter((list) => list.delete);

      return await ctx.prisma.board.update({
        where: {
          id: board.id,
          ownerId: ctx.auth.userId,
        },
        data: {
          ...board,
          lists: {
            create: listsToCreate,
            updateMany: listsToUpdate.map((list) => ({
              where: {
                id: list.id,
              },
              data: list,
            })),
            deleteMany: listsToDelete.map((list) => ({
              id: list.id,
            })),
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        boardId: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.board.delete({
        where: {
          id: input.boardId,
          ownerId: ctx.auth.userId,
        },
      });
    }),
});
