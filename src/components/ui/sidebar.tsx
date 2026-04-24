import * as React from "react";
import { cn } from "@/lib/utils";

type SidebarState = "expanded" | "collapsed";

interface SidebarContextValue {
  state: SidebarState;
  toggle: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<SidebarState>("expanded");

  const toggle = React.useCallback(() => {
    setState((prev) => (prev === "expanded" ? "collapsed" : "expanded"));
  }, []);

  const value = React.useMemo(() => ({ state, toggle }), [state, toggle]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsible?: "icon" | "none";
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(function Sidebar(
  { className, collapsible, ...props },
  ref,
) {
  const { state } = useSidebar();
  const collapsed = collapsible === "icon" && state === "collapsed";

  return (
    <aside
      ref={ref}
      className={cn(
        "border-r border-border/40 bg-card text-card-foreground flex flex-col h-screen transition-all duration-200",
        collapsed ? "w-16" : "w-64",
        className,
      )}
      {...props}
    />
  );
});

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn("border-b border-border/40 px-4 py-3", className)} {...props} />;
  },
);

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn("mt-auto border-t px-3 py-2", className)} {...props} />;
  },
);

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex-1 overflow-y-auto px-2 py-2 space-y-2", className)} {...props} />;
  },
);

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroup({ className, ...props }, ref) {
    return <div ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroupLabel({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", className)}
        {...props}
      />
    );
  },
);

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroupContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  function SidebarMenu({ className, ...props }, ref) {
    return <ul ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  function SidebarMenuItem({ className, ...props }, ref) {
    return <li ref={ref} className={cn(className)} {...props} />;
  },
);

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  function SidebarMenuButton({ className, asChild, ...props }, ref) {
    const Comp: any = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
          className,
        )}
        {...props}
      />
    );
  },
);

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  function SidebarTrigger({ className, ...props }, ref) {
    const { toggle } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
          className,
        )}
        {...props}
      >
        <span className="sr-only">Toggle sidebar</span>
        <span className="h-3 w-3 border-l-2 border-b-2 border-current rotate-45" />
      </button>
    );
  },
);

