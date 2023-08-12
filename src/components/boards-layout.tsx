import FloatingAddButton from "./floating-add-button";
import dynamic from "next/dynamic";
const Sidebar = dynamic(() => import("./sidebar"), {
  ssr: false,
});

export default function BoardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid h-full grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="col-span-2 grid h-screen grid-cols-1 grid-rows-[auto_1fr] md:col-span-1">
        {children}
      </div>
      <FloatingAddButton className="md:hidden" />
    </div>
  );
}
