import BoardsLayout from "@/components/boards-layout";
import { api } from "@/utils/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import type { ReactElement } from "react";

export default function BoardsIndex() {
  const { push } = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return <p>Getting user information.</p>;
  }

  const { data, isLoading } = api.boards.getFirstCreated.useQuery({
    user_id: user.id,
  });
  if (isLoading) return <p>Redirecting...</p>;

  if (data) {
    push(`/boards/${data.id}`).catch((e) =>
      console.error("Couldn't redirect to a board", e)
    );
  }

  return (
    <>
      <h1>You don&apos;t have any boards yet.</h1>
    </>
  );
}

BoardsIndex.getLayout = function getLayout(page: ReactElement) {
  return <BoardsLayout>{page}</BoardsLayout>;
};
