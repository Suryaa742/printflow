import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Factory, AlertTriangle, CalendarClock, Gauge, Building2, CalendarDays, Package, ArrowRight } from "lucide-react";
import { PageHeader, Panel, StatCard, StatusBadge, ProgressBar } from "@/components/pf/ui";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { fmtDate, orders, stages, supplierById, type Order } from "@/data/printflow";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/production")({
  head: () => ({
    meta: [
      { title: "Production Tracking — PrintFlow" },
      { name: "description", content: "Kanban production pipeline across approval, procurement, printing, finishing, inspection and dispatch." },
      { property: "og:title", content: "Production Tracking — PrintFlow" },
      { property: "og:description", content: "Production pipeline board for print and packaging orders." },
    ],
  }),
  component: ProductionPage,
});

const stageSupplierIdx: Record<string, number> = { "Awaiting Approval": 0, "Material Procurement": 0, Printing: 1, Finishing: 2, "Quality Inspection": 2, "Ready for Dispatch": 3 };
const active = orders.filter((o) => stages.includes(o.stage));
const colAccent: Partial<Record<string, string>> = {
  "Awaiting Approval": "bg-warning", "Material Procurement": "bg-chart-teal", Printing: "bg-primary", Finishing: "bg-chart-violet", "Quality Inspection": "bg-chart-2", "Ready for Dispatch": "bg-success",
};

function ProductionPage() {
  const [sel, setSel] = useState<Order | null>(null);
  const supplierFor = (o: Order) => supplierById(o.suppliers[Math.min(stageSupplierIdx[o.stage] ?? 0, o.suppliers.length - 1)] ?? "");

  return (
    <div className="mx-auto max-w-[1700px]">
      <PageHeader title="Production Tracking" subtitle="Monitor every order across the production pipeline and spot bottlenecks early." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Orders in pipeline" value={String(active.length + 32)} icon={Factory} tone="info" change={4.3} />
        <StatCard label="Delayed production tasks" value="03" icon={AlertTriangle} tone="danger" change={-25} />
        <StatCard label="Milestones due this week" value="11" icon={CalendarClock} tone="warning" />
        <StatCard label="Capacity utilisation" value="87%" icon={Gauge} tone="success" change={3.1} />
      </div>

      <Panel className="mt-6" title="Production Pipeline Overview" subtitle="Orders by production stage (all 48 active orders)">
        <div className="flex h-3 overflow-hidden rounded-full">
          {[["Awaiting Approval", 7], ["Material Procurement", 9], ["Printing", 12], ["Finishing", 8], ["Quality Inspection", 6], ["Ready for Dispatch", 6]].map(([s, n]) => (
            <div key={s} className={cn(colAccent[s as string] ?? "", "border-r-2 border-card last:border-0")} style={{ width: `${((n as number) / 48) * 100}%` }} />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 lg:grid-cols-6">
          {[["Awaiting Approval", 7], ["Material Procurement", 9], ["Printing", 12], ["Finishing", 8], ["Quality Inspection", 6], ["Ready for Dispatch", 6]].map(([s, n]) => (
            <div key={s} className="flex items-center gap-2 text-xs"><span className={cn("size-2.5 rounded-sm", colAccent[s as string])} /><span className="text-muted-foreground">{s}</span><span className="ml-auto font-semibold">{n}</span></div>
          ))}
        </div>
      </Panel>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-3">
        {stages.map((stage) => {
          const cards = active.filter((o) => o.stage === stage);
          return (
            <div key={stage} className="flex w-[280px] shrink-0 flex-col rounded-xl bg-muted/60 p-2.5">
              <div className="flex items-center gap-2 px-1.5 pb-2.5 pt-1">
                <span className={cn("size-2 rounded-full", colAccent[stage])} />
                <span className="text-[13px] font-semibold">{stage}</span>
                <span className="ml-auto rounded-md bg-card px-1.5 text-xs font-medium text-muted-foreground">{cards.length}</span>
              </div>
              <div className="space-y-2.5">
                {cards.map((o) => (
                  <button key={o.id} onClick={() => setSel(o)} className={cn("w-full rounded-lg border bg-card p-3 text-left shadow-[0_1px_2px_0_rgb(16_24_40/0.04)] transition hover:border-primary/40 hover:shadow-md",
                    o.status === "Delayed" && "border-l-[3px] border-l-destructive", o.status === "At Risk" && "border-l-[3px] border-l-warning")}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-primary">{o.id}</span>
                      <StatusBadge status={o.priority} />
                    </div>
                    <div className="mt-2 text-[13px] font-semibold leading-snug">{o.product}</div>
                    <div className="text-xs text-muted-foreground">{o.customer}</div>
                    <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Package className="size-3.5" />{o.quantity.toLocaleString()} units</div>
                      <div className="flex items-center gap-1.5"><Building2 className="size-3.5" />{supplierFor(o)?.name}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t pt-2.5">
                      <span className="flex items-center gap-1 text-xs"><CalendarDays className="size-3.5 text-muted-foreground" />Due {fmtDate(o.delivery, { month: "short", day: "2-digit" })}</span>
                      <StatusBadge status={o.status} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Delayed Production Tasks" subtitle="Tasks past their planned completion">
          <ul className="space-y-3">
            {[["PF-2026-0148", "Printing · Gulf Print Solutions", "2 days late"], ["PF-2026-0158", "Finishing · Premium Finishing Works", "Reprint after QC fail"], ["PF-2026-0162", "Material · Royal Paper Industries", "3 days late"]].map(([id, t, d]) => (
              <li key={id} className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-danger-soft/50 p-3">
                <AlertTriangle className="size-4 text-destructive" />
                <div className="flex-1"><Link to="/orders/$orderId" params={{ orderId: id ?? "" }} className="font-mono text-xs font-semibold text-primary">{id}</Link><div className="text-[13px]">{t}</div></div>
                <span className="text-xs font-semibold text-destructive">{d}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Upcoming Milestones" subtitle="Next 7 days">
          <ul className="divide-y">
            {[["Nov 27", "Finishing start", "PF-2026-0148"], ["Nov 28", "Dispatch – Nahdi carry bags", "PF-2026-0156"], ["Nov 29", "QC sign-off – STC SIM packs", "PF-2026-0159"], ["Nov 30", "Event wristbands dispatch", "PF-2026-0153"], ["Dec 01", "Al Noor delivery commitment", "PF-2026-0148"], ["Dec 02", "Catalogue print complete", "PF-2026-0155"]].map(([d, t, id]) => (
              <li key={t} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                <span className="w-14 text-xs font-semibold text-muted-foreground">{d}</span>
                <span className="flex-1 text-[13px]">{t}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{id}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Production Schedule" subtitle="Line utilisation this week">
          <ul className="space-y-4">
            {[["Heidelberg XL-106 (Gulf Print)", 100, "danger"], ["Komori GL-40 (Gulf Print)", 82, "info"], ["HP Indigo 12K (Creative Print)", 74, "info"], ["Lamination line 2 (Premium)", 91, "warning"], ["Die-cutting Bobst (Al Fajr)", 63, "success"]].map(([n, v, t]) => (
              <li key={n as string}><div className="mb-1.5 flex justify-between text-[13px]"><span>{n}</span><span className="font-medium tabular-nums">{v}%</span></div><ProgressBar value={v as number} tone={t as "info"} /></li>
            ))}
          </ul>
        </Panel>
      </div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {sel && (
            <>
              <SheetHeader>
                <SheetTitle className="font-mono">{sel.id}</SheetTitle>
                <SheetDescription>{sel.product} · {sel.customer}</SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4">
                <div className="flex gap-2"><StatusBadge status={sel.status} /><StatusBadge status={`${sel.priority} Priority`} tone={sel.priority === "High" ? "danger" : "warning"} /></div>
                <dl className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
                  <div><dt className="text-xs text-muted-foreground">Current stage</dt><dd className="font-medium">{sel.stage}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Quantity</dt><dd className="font-medium">{sel.quantity.toLocaleString()} units</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Order date</dt><dd className="font-medium">{fmtDate(sel.orderDate)}</dd></div>
                  <div><dt className="text-xs text-muted-foreground">Due date</dt><dd className="font-medium">{fmtDate(sel.delivery)}</dd></div>
                </dl>
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned suppliers</div>
                  <ul className="space-y-2">{sel.suppliers.map((id) => { const s = supplierById(id); return <li key={id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"><span>{s?.name}</span><span className="text-xs text-muted-foreground">{s?.category}</span></li>; })}</ul>
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-xs"><span className="text-muted-foreground">Stage progress</span><span className="font-medium">{(stages.indexOf(sel.stage) + 1)} / {stages.length}</span></div>
                  <ProgressBar value={((stages.indexOf(sel.stage) + 1) / stages.length) * 100} tone={sel.status === "Delayed" ? "danger" : sel.status === "At Risk" ? "warning" : "info"} />
                </div>
                <Button asChild className="w-full"><Link to="/orders/$orderId" params={{ orderId: sel.id }}>Open full order <ArrowRight /></Link></Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
