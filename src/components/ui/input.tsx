import * as React from "react";

import { cn } from "@/lib/utils";
import { useFormField } from "./form";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const { error } = useFormField();
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[4px] border border-medium-grey/25 bg-transparent px-4 py-2  text-body-l ring-offset-white file:border-0 file:bg-transparent file:text-body-l placeholder:text-black/25 hover:border-main-purple focus:border-main-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-950 dark:placeholder:text-white/25 dark:focus-visible:ring-slate-300",
          { "border-red": error },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
