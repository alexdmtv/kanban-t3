import BoardsLayout from "@/components/boards-layout";
import Button from "@/components/button";
import Spinner from "@/components/spinner";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

export default function BoardsIndex() {
  const { push } = useRouter();

  const { data, isLoading } = api.boards.getFirstCreated.useQuery();
  const spinnerComponent = (
    <div className="col-span-2 flex h-screen flex-col items-center justify-center">
      <Spinner className="h-20 w-20" />
    </div>
  );

  if (isLoading) return spinnerComponent;

  if (data) {
    void push(`/boards/${data.id}`);

    return spinnerComponent;
  }

  return (
    <>
      <div className="row-span-2 flex flex-col items-center justify-center gap-8 text-heading-l text-medium-grey">
        <h1>
          You have not created any boards yet. Create a new board to get
          started.
        </h1>
        <Button btnType="primary" size="L" className="w-auto px-5">
          + Create New Board
        </Button>
      </div>
    </>
  );
}

BoardsIndex.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
