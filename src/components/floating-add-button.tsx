import Button from "./button";
import Image from "next/image";
import addTaskSvg from "../../public/icon-add-task-mobile.svg";
import { cn } from "@/lib/utils";

export default function FloatingAddButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      btnType="primary"
      size="S"
      className={cn(
        "absolute bottom-3 right-3 flex h-14 w-14 items-center justify-center rounded-full p-2",
        className
      )}
      {...props}
    >
      <Image src={addTaskSvg as string} width={20} alt="Add task" />
    </Button>
  );
}
