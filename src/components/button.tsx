import { cn } from "@/lib/utils";

export default function Button({
  children,
  className,
  btnType,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  btnType: "primary" | "secondary" | "destructive";
  size: "L" | "S";
}) {
  return (
    <button
      className={cn(
        "w-full rounded-3xl bg-main-purple py-3.5 text-heading-m text-white enabled:hover:bg-main-purple-hover disabled:cursor-not-allowed disabled:opacity-25",
        {
          "bg-main-purple/10 text-main-purple enabled:hover:bg-main-purple/25 dark:bg-white":
            btnType === "secondary",
          "bg-red enabled:hover:bg-red-hover": btnType === "destructive",
        },
        { "rounded-[1.25rem] py-2 text-body-l": size === "S" },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
