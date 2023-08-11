import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const boardsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  getAll: publicProcedure
    .input(
      z.object({
        user_id: z.string().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.boards.findMany({
        where: {
          owner_id: input.user_id,
        },
      });
    }),
  getFirstCreated: publicProcedure
    .input(
      z.object({
        user_id: z.string().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.boards.findFirst({
        where: {
          owner_id: input.user_id,
        },
        orderBy: {
          created_at: "asc",
        },
        take: 1,
      });
    }),
  getById: publicProcedure
    .input(
      z.object({
        board_id: z.number().min(1),
        user_id: z.string().min(1),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.boards.findFirst({
        where: {
          id: input.board_id,
          owner_id: input.user_id,
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
