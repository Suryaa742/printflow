import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, ClipboardList, KanbanSquare, Building2, FileText, Truck, ShieldCheck, ListChecks,
  BarChart3, Settings, Bell, Search, HelpCircle, PanelLeftClose, PanelLeftOpen, ChevronRight, ChevronDown, LogOut, User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { notifications } from "@/data/printflow";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { toneClasses } from "./ui";

const nav = [
  { group: "Overview", items: [{ title: "Dashboard", to: "/", icon: LayoutDashboard }] },
  { group: "Operations", items: [
    { title: "Orders", to: "/orders", icon: ClipboardList },
    { title: "Production Tracking", to: "/production", icon: KanbanSquare },
    { title: "Supplier Management", to: "/suppliers", icon: Building2 },
    { title: "Purchase Orders", to: "/purchase-orders", icon: FileText },
    { title: "Delivery & Logistics", to: "/logistics", icon: Truck },
  ] },
  { group: "Quality", items: [
    { title: "Quality Control", to: "/quality", icon: ShieldCheck },
    { title: "Inspections", to: "/inspections", icon: ListChecks },
  ] },
  { group: "Insights", items: [{ title: "Reports & Analytics", to: "/reports", icon: BarChart3 }, { title: "Notifications", to: "/notifications", icon: Bell }] },
  { group: "Administration", items: [{ title: "Settings", to: "/settings", icon: Settings }] },
] as const;

const crumbNames: Record<string, string> = {
  orders: "Orders", production: "Production Tracking", suppliers: "Supplier Management", "purchase-orders": "Purchase Orders",
  logistics: "Delivery & Logistics", quality: "Quality Control", inspections: "Inspections", reports: "Reports & Analytics",
  notifications: "Notifications", settings: "Settings",
};

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path d="M9 11.5 16 8l7 3.5v9L16 24l-7-3.5z" fill="none" className="stroke-primary-foreground" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 11.5 16 15l7-3.5M16 15v9" fill="none" className="stroke-primary-foreground" strokeWidth="1.8" strokeLinejoin="round" opacity=".7" />
    </svg>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => (to === "/" ? path === "/" : path === to || path.startsWith(to + "/"));
  const segs = path.split("/").filter(Boolean);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r bg-sidebar transition-[width] duration-200 md:flex", collapsed ? "w-[68px]" : "w-[248px]")}>
        <div className="flex h-16 items-center gap-2.5 border-b px-4">
          <Logo />
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">PrintFlow</div>
              <div className="text-[11px] text-muted-foreground">Production Management</div>
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {nav.map((g) => (
            <div key={g.group} className="mb-4">
              {!collapsed && <div className="mb-1.5 px-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/80">{g.group}</div>}
              {g.items.map((it) => {
                const active = isActive(it.to);
                return (
                  <Link key={it.to} to={it.to} title={it.title}
                    className={cn("mb-0.5 flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13px] font-medium transition-colors",
                      active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-0")}>
                    <it.icon className={cn("size-[18px] shrink-0", active && "text-primary")} />
                    {!collapsed && <span className="truncate">{it.title}</span>}
                    {!collapsed && it.to === "/notifications" && <span className="ml-auto rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-destructive-foreground">{unread}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <button onClick={() => setCollapsed((c) => !c)} className="m-3 flex h-9 items-center justify-center gap-2 rounded-lg border text-xs font-medium text-muted-foreground hover:bg-muted">
          {collapsed ? <PanelLeftOpen className="size-4" /> : <><PanelLeftClose className="size-4" /> Collapse</>}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card/95 px-6 backdrop-blur">
          <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">PrintFlow</Link>
            {segs.length === 0 && <><ChevronRight className="size-3.5 text-muted-foreground" /><span className="font-medium">Dashboard</span></>}
            {segs.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <ChevronRight className="size-3.5 text-muted-foreground" />
                <span className={cn(i === segs.length - 1 ? "font-medium text-foreground" : "text-muted-foreground")}>{crumbNames[s] ?? decodeURIComponent(s)}</span>
              </span>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <label className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search orders, suppliers, POs…" className="h-9 w-72 rounded-lg border bg-background pl-9 pr-12 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15" />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border bg-card px-1.5 text-[10px] text-muted-foreground">⌘K</kbd>
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button aria-label="Notifications" className="relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Bell className="size-[18px]" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-card" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[380px] p-0">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-sm font-semibold">Notifications <span className="ml-1 rounded-full bg-danger-soft px-1.5 text-xs text-destructive">{unread} new</span></div>
                  <button onClick={() => toast.success("All notifications marked as read")} className="text-xs font-medium text-primary">Mark all read</button>
                </div>
                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.slice(0, 5).map((n) => {
                    const tone = n.severity === "Critical" || n.severity === "High" ? "danger" : n.severity === "Medium" ? "warning" : "info";
                    return (
                      <div key={n.id} className="flex gap-3 border-b px-4 py-3 last:border-0 hover:bg-muted/50">
                        <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", toneClasses[tone].dot)} />
                        <div className="min-w-0">
                          <div className="text-[13px] font-medium leading-snug">{n.title}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{n.order} · {n.category} · {n.time}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link to="/notifications" className="block border-t py-2.5 text-center text-xs font-medium text-primary hover:bg-muted/50">View all notifications</Link>
              </PopoverContent>
            </Popover>
            <button aria-label="Help" onClick={() => toast("Help Center", { description: "Documentation and support are available 24/7." })} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
              <HelpCircle className="size-[18px]" />
            </button>
            <div className="mx-1 h-6 w-px bg-border" />
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2.5 rounded-lg py-1 pl-1 pr-2 hover:bg-muted">
                <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">AK</span>
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-[13px] font-medium">Abdullah</span>
                  <span className="block text-[11px] text-muted-foreground">Operations Manager</span>
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>abdullah.k@printflow.sa</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/settings"><User className="size-4" /> My profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/settings"><Settings className="size-4" /> Settings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast("Sign-out is disabled in this demo")}><LogOut className="size-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 px-6 py-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}
