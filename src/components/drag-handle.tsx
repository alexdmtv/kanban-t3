import { cn } from "@/lib/utils";

type DragHandleProps = React.ComponentPropsWithoutRef<"button">;

export default function DragHandle({ className, ...props }: DragHandleProps) {
  return (
    <button
      {...props}
      className={cn(
        "cursor-grab touch-none select-none rounded-md bg-transparent px-0.5 py-1.5 text-dark-grey/60 hover:!text-main-purple-hover hover:outline hover:outline-main-purple-hover/50 active:cursor-grabbing dark:text-light-grey/60",
        className
      )}
    >
      <svg
        fill="none"
        height="20"
        viewBox="0 0 48 48"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          clipRule="evenodd"
          d="M19 10C19 12.2091 17.2091 14 15 14C12.7909 14 11 12.2091 11 10C11 7.79086 12.7909 6 15 6C17.2091 6 19 7.79086 19 10ZM15 28C17.2091 28 19 26.2091 19 24C19 21.7909 17.2091 20 15 20C12.7909 20 11 21.7909 11 24C11 26.2091 12.7909 28 15 28ZM15 42C17.2091 42 19 40.2091 19 38C19 35.7909 17.2091 34 15 34C12.7909 34 11 35.7909 11 38C11 40.2091 12.7909 42 15 42Z"
          fill="currentColor"
          fillRule="evenodd"
        />
        <path
          clipRule="evenodd"
          d="M37 10C37 12.2091 35.2091 14 33 14C30.7909 14 29 12.2091 29 10C29 7.79086 30.7909 6 33 6C35.2091 6 37 7.79086 37 10ZM33 28C35.2091 28 37 26.2091 37 24C37 21.7909 35.2091 20 33 20C30.7909 20 29 21.7909 29 24C29 26.2091 30.7909 28 33 28ZM33 42C35.2091 42 37 40.2091 37 38C37 35.7909 35.2091 34 33 34C30.7909 34 29 35.7909 29 38C29 40.2091 30.7909 42 33 42Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </button>
  );
}
