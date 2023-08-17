import { cn } from "@/lib/utils";
import IconButton from "./icon-button";

export default function DeleteItemButton({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <IconButton
      onClick={onClick}
      className={cn("fill-medium-grey", className)}
      {...props}
    >
      <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
        <g fillRule="evenodd">
          <path d="m12.728 0 2.122 2.122L2.122 14.85 0 12.728z" />
          <path d="M0 2.122 2.122 0 14.85 12.728l-2.122 2.122z" />
        </g>
      </svg>
    </IconButton>
  );
}
