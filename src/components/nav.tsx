import Link from "next/link";
import BoardIconSvg from "./board-icon-svg";
import { cn } from "@/lib/utils";
import UserButton from "./user-button";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

// import ThemeSwitcher dinamucally
import dynamic from "next/dynamic";
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

  const { data: boards } = api.boards.getAll.useQuery();

  return (
    <nav className={cn("flex flex-col", className)}>
      <div className="mb-5 flex items-center gap-4 pl-6">
        {withUserButton && <UserButton className="" />}
        <h3 className="text-heading-s uppercase text-medium-grey">
          All boards ({boards?.length ?? 0})
        </h3>
      </div>

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
                className={cn("fill-medium-grey group-hover:fill-main-purple", {
                  "fill-white group-hover:fill-white":
                    pathname === `/boards/${b.id}`,
                })}
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
      <ThemeSwitcher />
    </nav>
  );
}
