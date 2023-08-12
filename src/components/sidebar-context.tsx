import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext<{
  collapsed: boolean;
  toggleSidebar: () => void;
} | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  function getSidebarInitialState() {
    if (typeof window === "undefined") {
      return false; // Return your default state value
    }

    const LScollapsed = localStorage.getItem("collapsed");
    if (LScollapsed) {
      const parsedValue: unknown = JSON.parse(LScollapsed);
      if (typeof parsedValue === "boolean") {
        return parsedValue;
      }
    }
    return false;
  }

  const [collapsed, setCollapsed] = useState(getSidebarInitialState);

  // useEffect(() => {
  //   const LScollapsed = localStorage.getItem("collapsed");
  //   if (LScollapsed) {
  //     const parsedValue: unknown = JSON.parse(LScollapsed);
  //     if (typeof parsedValue === "boolean") {
  //       setCollapsed(parsedValue);
  //     }
  //   } else {
  //     localStorage.setItem("collapsed", JSON.stringify(collapsed));
  //   }
  // }, [collapsed]);

  function toggleSidebar() {
    setCollapsed((prev) => {
      localStorage.setItem("collapsed", JSON.stringify(!prev));
      return !prev;
    });
  }

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
