import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-medium-grey/25 bg-white ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-main-purple data-[state=checked]:text-white dark:bg-very-dark-grey dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-main-purple",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex flex-row items-center justify-center text-current")}
    >
      <svg width="10" height="8" xmlns="http://www.w3.org/2000/svg">
        <path
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          d="m1.276 3.066 2.756 2.756 5-5"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
