import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { insertBoardSchema, updateBoardSchema } from "@/lib/types";

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

  create: protectedProcedure
    .input(insertBoardSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.board.create({
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
    .mutation(({ ctx, input }) => {
      const { lists, ...board } = input;

      const listsToCreate = lists.filter((list) => !list.id);
      const listsToUpdate = lists.filter((list) => list.id);
      const listsToDelete = lists.filter((list) => list.delete);

      return ctx.prisma.board.update({
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
    .mutation(({ ctx, input }) => {
      return ctx.prisma.board.delete({
        where: {
          id: input.boardId,
          ownerId: ctx.auth.userId,
        },
      });
    }),
});
