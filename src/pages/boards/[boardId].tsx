import BoardHeader from "@/components/board-header";
import BoardList from "@/components/board-list";
import BoardsLayout from "@/components/boards-layout";
import Button from "@/components/button";
import NewColumn from "@/components/new-column";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

export default function BoardPage() {
  const { query } = useRouter();

  const { data: board, isLoading } = api.boards.getById.useQuery({
    board_id: +(query.boardId as string),
  });

  // Data is finished loading, but there is no board
  if (!board && !isLoading) return <p>Board not found.</p>;

  // Data is finished loading, but there are no lists
  if (!isLoading && board?.lists?.length === 0) {
    return (
      <>
        <BoardHeader board={board} />
        <div className="flex flex-col items-center justify-center gap-8 text-heading-l text-medium-grey">
          <h1>This board is empty. Create a new list to get started.</h1>
          <Button btnType="primary" size="L" className="w-auto px-5">
            + Create New List
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <BoardHeader board={board} isLoading={isLoading} />
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <Spinner className="h-20 w-20" />
        </div>
      ) : (
        <div className="overflow-auto">
          <div className="mx-4 my-6 grid min-h-[42rem] grid-flow-col justify-start gap-6">
            {board?.lists?.map((list) => (
              <BoardList key={list.id} list={list} />
            ))}
            <NewColumn />
          </div>
        </div>
      )}
    </>
  );
}

BoardPage.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
