import Link from "next/link";
import BoardIconSvg from "./board-icon-svg";
import { cn } from "@/lib/utils";
import UserButton from "./user-button";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

// import ThemeSwitcher dinamucally
import dynamic from "next/dynamic";
import { Skeleton } from "./ui/skeleton";
import { useAuth } from "@clerk/nextjs";
const ThemeSwitcher = dynamic(() => import("./theme-switcher"), {
  ssr: false,
});

export default function Nav({
  className,
  withUserButton,
}: {
  className?: string;
  withUserButton?: boolean;
}) {
  const { asPath: pathname } = useRouter();

  const { data: boards, isLoading: dataIsLoading } =
    api.boards.getAll.useQuery();

  const { isLoaded: userLoaded } = useAuth();

  return (
    <nav className={cn("flex flex-col", className)}>
      <div className="mb-5 flex items-center gap-4 pl-6">
        {withUserButton &&
          (userLoaded ? (
            <UserButton className="" />
          ) : (
            <Skeleton className="h-8 w-8 rounded-full bg-medium-grey/20 dark:bg-medium-grey/10" />
          ))}
        {dataIsLoading ? (
          <Skeleton className="h-5 bg-medium-grey/20 dark:bg-medium-grey/10" />
        ) : (
          <h3 className="text-heading-s uppercase text-medium-grey">
            All boards ({boards?.length ?? 0})
          </h3>
        )}
      </div>

      {dataIsLoading ? (
        <ul className="mb-auto space-y-2">
          <Skeleton className="h-10 rounded-e-full bg-medium-grey/20 dark:bg-medium-grey/10" />
          <Skeleton className="h-10 rounded-e-full bg-medium-grey/20 dark:bg-medium-grey/10" />
          <Skeleton className="h-10 rounded-e-full bg-medium-grey/20 dark:bg-medium-grey/10" />
          <Skeleton className="h-10 rounded-e-full bg-medium-grey/20 dark:bg-medium-grey/10" />
        </ul>
      ) : (
        <ul className="mb-auto">
          {boards?.map((b) => (
            <li
              key={b.id}
              className={cn(
                "group rounded-e-full text-medium-grey hover:bg-main-purple/10 hover:text-main-purple dark:hover:bg-white",
                {
                  "bg-main-purple text-white hover:bg-main-purple hover:text-white dark:bg-main-purple dark:hover:bg-main-purple":
                    pathname === `/boards/${b.id}`,
                }
              )}
            >
              <Link
                href={`/boards/${b.id}`}
                className="flex items-center gap-3 py-3.5 pl-6 text-heading-m"
              >
                <BoardIconSvg
                  className={cn(
                    "fill-medium-grey group-hover:fill-main-purple",
                    {
                      "fill-white group-hover:fill-white":
                        pathname === `/boards/${b.id}`,
                    }
                  )}
                />

                <span>{b.name}</span>
              </Link>
            </li>
          ))}
          <button className="flex w-full items-center gap-3 rounded-e-full py-3.5 pl-6 text-heading-m text-main-purple hover:bg-main-purple/10 hover:text-main-purple dark:hover:bg-white">
            <BoardIconSvg className="fill-main-purple" />
            <span>+ Create new board</span>
          </button>
        </ul>
      )}
      <ThemeSwitcher />
    </nav>
  );
}
