import { twMerge } from "tailwind-merge";

export default function IconButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={twMerge("p-4", className)} {...props}>
      {children}
    </button>
  );
}
