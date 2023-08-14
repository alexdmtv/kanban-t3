import { z } from "zod";

export const ListSchema = z.object({
  name: z.string().min(1, {
    message: "List name must be at least 1 character long",
  }),
  colorCode: z.string(),
  boardPosition: z.number(),
  boardId: z.number(),
});

export const BoardSchema = z.object({
  name: z.string().min(1, {
    message: "Board name must be at least 1 character long",
  }),
  lists: z.array(ListSchema).optional(),
});

export type TBoardSchema = z.infer<typeof BoardSchema>;
export type TListSchema = z.infer<typeof ListSchema>;
