import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const IconButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(
  (
    {
      children,
      className,
      ...props
    }: {
      children?: React.ReactNode;
      className?: string;
      props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    },
    ref
  ) => (
    <button ref={ref} className={cn("p-4", className)} {...props}>
      {children}
    </button>
  )
);

IconButton.displayName = "IconButton";

export default IconButton;
