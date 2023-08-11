import { useState } from "react";
import DesktopLogo from "./desktop-logo";
import Nav from "./nav";
import SidebarIcon from "./sidebar-icon-svg";
import { cn } from "@/lib/utils";

export default function Sidebar({ className }: { className?: string }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      id="sidebar"
      className={cn(
        "hidden flex-col border-r border-lines-light bg-white pb-8 transition-[width] duration-300 ease-in-out dark:border-lines-dark dark:bg-dark-grey md:col-span-1 md:flex md:w-[16.3125rem] lg:w-[18.75rem]",
        className,
        { "overflow-hidden md:w-0 lg:w-0": collapsed }
      )}
    >
      <div className="flex h-20 items-center lg:h-24">
        <DesktopLogo className="ml-6 lg:ml-8" />
      </div>

      <Nav
        withUserButton
        className={cn("mr-5 mt-8 h-full min-w-max lg:mr-6")}
      />

      <button
        onClick={() => setCollapsed((collapsed) => !collapsed)}
        id="sidebar-toggle-button"
        className={cn(
          "group group mr-5 mt-2 flex items-center gap-3 rounded-e-full py-3.5 pl-6 text-heading-m text-medium-grey hover:bg-main-purple/10 hover:text-main-purple dark:hover:bg-white lg:mr-6",
          {
            "absolute bottom-8 left-0 m-0 bg-main-purple p-[1.125rem]":
              collapsed,
          }
        )}
      >
        <SidebarIcon
          type={collapsed ? "show" : "hide"}
          className={cn("fill-medium-grey group-hover:fill-main-purple", {
            "fill-white": collapsed,
          })}
        />
        <span className={cn("whitespace-nowrap", { hidden: collapsed })}>
          Hide Sidebar
        </span>
      </button>

      <button
        onClick={() => setCollapsed((collapsed) => !collapsed)}
        id="sidebar-toggle-button"
        className={cn(
          "group group mr-5 mt-2 hidden items-center gap-3 rounded-e-full py-3.5 pl-6 text-heading-m text-medium-grey hover:bg-main-purple/10 hover:text-main-purple dark:hover:bg-white lg:mr-6",
          { flex: collapsed }
        )}
      >
        <SidebarIcon
          type="hide"
          className="fill-medium-grey group-hover:fill-main-purple"
        />
        <span className={cn("whitespace-nowrap", { invisible: collapsed })}>
          Hide Sidebar
        </span>
      </button>
    </aside>
  );
}
