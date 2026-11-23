import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Factory, Clock, ShieldAlert, CalendarCheck, CheckCheck, Bell } from "lucide-react";
import { PageHeader, StatusBadge, toneClasses } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { notifications as seed } from "@/data/printflow";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — PrintFlow" },
      { name: "description", content: "Supplier delays, production delays, approvals, quality issues and upcoming deliveries in one place." },
      { property: "og:title", content: "Notifications — PrintFlow" },
      { property: "og:description", content: "Operational alerts for print and packaging production." },
    ],
  }),
  component: NotificationsPage,
});

const cats = [
  { name: "All", icon: Bell }, { name: "Supplier Delay", icon: Truck }, { name: "Production Delay", icon: Factory },
  { name: "Pending Approval", icon: Clock }, { name: "Quality Issue", icon: ShieldAlert }, { name: "Upcoming Delivery", icon: CalendarCheck },
];
const sevTone = { Critical: "danger", High: "danger", Medium: "warning", Info: "info" } as const;

function NotificationsPage() {
  const [items, setItems] = useState(seed);
  const [cat, setCat] = useState("All");
  const list = items.filter((n) => cat === "All" || n.category === cat);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Notification Center" subtitle="Operational alerts across suppliers, production, quality and delivery."
        actions={<Button variant="outline" size="sm" onClick={() => setItems((i) => i.map((n) => ({ ...n, unread: false })))}><CheckCheck /> Mark all as read</Button>} />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {cats.map((c) => {
            const n = c.name === "All" ? items.length : items.filter((i) => i.category === c.name).length;
            return (
              <button key={c.name} onClick={() => setCat(c.name)} className={cn("flex h-9 w-full items-center gap-2.5 rounded-lg px-3 text-[13px] font-medium", cat === c.name ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted")}>
                <c.icon className="size-4" />{c.name}<span className="ml-auto text-xs">{n}</span>
              </button>
            );
          })}
        </nav>
        <div className="divide-y rounded-xl border bg-card">
          {list.map((n) => {
            const tone = sevTone[n.severity as keyof typeof sevTone];
            const Icon = cats.find((c) => c.name === n.category)?.icon ?? Bell;
            return (
              <div key={n.id} onClick={() => setItems((i) => i.map((x) => (x.id === n.id ? { ...x, unread: false } : x)))} className={cn("flex cursor-pointer gap-4 px-5 py-4 hover:bg-muted/40", n.unread && "bg-info-soft/40")}>
                <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", toneClasses[tone].icon)}><Icon className="size-[18px]" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{n.title}</span>
                    {n.unread && <span className="size-2 rounded-full bg-primary" />}
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">{n.body}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <StatusBadge status={n.severity} tone={tone} />
                    <span>{n.category}</span><span>·</span>
                    <Link to="/orders/$orderId" params={{ orderId: n.order }} onClick={(e) => e.stopPropagation()} className="font-mono text-primary">{n.order}</Link>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
