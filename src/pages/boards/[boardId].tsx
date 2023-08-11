import BoardHeader from "@/components/board-header";
import BoardList from "@/components/board-list";
import BoardsLayout from "@/components/boards-layout";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

export default function BoardPage() {
  const { query } = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <p>Loading...</p>;
  }

  const { data: board, isLoading } = api.boards.getById.useQuery({
    user_id: user.id,
    board_id: +(query.boardId as string),
  });

  if (!board && !isLoading) return { notFound: true };

  return (
    <>
      <BoardHeader board={board} />
      <div className="overflow-auto">
        <div className="mx-4 my-6 grid grid-flow-col justify-start gap-6">
          {board?.lists?.map((list) => (
            <BoardList key={list.id} list={list} />
          ))}
        </div>
      </div>
    </>
  );
}

BoardPage.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
