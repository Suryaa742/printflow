import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageCheck, Truck, CheckCircle2, TimerOff, Package, Warehouse, MapPin, Check, Search } from "lucide-react";
import { PageHeader, Panel, StatCard, StatusBadge, th, td } from "@/components/pf/ui";
import { fmtDate, shipments } from "@/data/printflow";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/logistics")({
  head: () => ({
    meta: [
      { title: "Delivery & Logistics — PrintFlow" },
      { name: "description", content: "Track shipments, logistics partners and delivery progress for every customer order." },
      { property: "og:title", content: "Delivery & Logistics — PrintFlow" },
      { property: "og:description", content: "Shipment tracking for print and packaging deliveries." },
    ],
  }),
  component: LogisticsPage,
});

const STEPS = ["Packing", "Ready for Dispatch", "Dispatched", "In Transit", "Delivered"];

function LogisticsPage() {
  const [selId, setSelId] = useState("SHP-2026-0884");
  const [q, setQ] = useState("");
  const sel = shipments.find((s) => s.id === selId) ?? shipments[0]!;
  const rows = shipments.filter((s) => [s.id, s.order, s.customer, s.ref].some((v) => v.toLowerCase().includes(q.toLowerCase())));
  const delayed = sel.status === "Delayed";

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Delivery & Logistics" subtitle="Coordinate dispatch with logistics partners and track every shipment to the customer." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending Deliveries" value="14" icon={PackageCheck} tone="warning" change={7.7} />
        <StatCard label="In Transit" value="06" icon={Truck} tone="info" change={20} />
        <StatCard label="Delivered (Nov)" value="118" icon={CheckCircle2} tone="success" change={9.3} />
        <StatCard label="Delayed Shipments" value="02" icon={TimerOff} tone="danger" change={-33.3} />
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.35fr_1fr]">
        <div className="min-w-0 rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-3 border-b px-5 py-3.5">
            <h2 className="text-sm font-semibold">Shipments</h2>
            <label className="relative w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search shipment or tracking ref" className="h-8 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40"><tr>{["Shipment", "Order", "Customer", "Partner", "Dispatch", "Arrival", "Status", "Tracking Ref"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {rows.map((s) => (
                  <tr key={s.id} onClick={() => setSelId(s.id)} className={cn("cursor-pointer hover:bg-muted/40", s.id === selId && "bg-info-soft/60")}>
                    <td className={`${td} font-mono text-xs font-medium text-primary`}>{s.id}</td>
                    <td className={`${td} font-mono text-xs`}>{s.order}</td>
                    <td className={td}>{s.customer}</td>
                    <td className={`${td} text-muted-foreground`}>{s.partner}</td>
                    <td className={`${td} tabular-nums`}>{fmtDate(s.dispatch, { month: "short", day: "2-digit" })}</td>
                    <td className={`${td} tabular-nums`}>{fmtDate(s.arrival, { month: "short", day: "2-digit" })}</td>
                    <td className={td}><StatusBadge status={s.status} /></td>
                    <td className={`${td} font-mono text-xs text-muted-foreground`}>{s.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Panel title={<span className="font-mono">{sel.id}</span>} subtitle={`${sel.customer} · ${sel.partner}`} actions={<StatusBadge status={sel.status} />}>
          <ol className="flex">
            {STEPS.map((st, i) => {
              const done = i < sel.step || sel.step === 4;
              const cur = i === sel.step && sel.step !== 4;
              return (
                <li key={st} className="relative flex flex-1 flex-col items-center text-center">
                  {i < STEPS.length - 1 && <span className={cn("absolute left-1/2 top-3.5 h-0.5 w-full", i < sel.step ? "bg-success" : "bg-border")} />}
                  <span className={cn("relative z-10 grid size-7 place-items-center rounded-full ring-4 ring-card", done ? "bg-success text-primary-foreground" : cur ? (delayed ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground") : "border-2 bg-card")}>
                    {done ? <Check className="size-3.5" /> : cur ? <span className="size-2 rounded-full bg-card" /> : null}
                  </span>
                  <span className={cn("mt-2 text-[11px] font-medium leading-tight", !done && !cur && "text-muted-foreground")}>{st}</span>
                </li>
              );
            })}
          </ol>

          <RouteMap from={sel.from} to={sel.to} progress={[0.04, 0.12, 0.3, delayed ? 0.55 : 0.66, 1][sel.step] ?? 0} delayed={delayed} />

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">Order</dt><dd className="font-medium"><Link to="/orders/$orderId" params={{ orderId: sel.order }} className="font-mono text-primary">{sel.order}</Link></dd></div>
            <div className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">Tracking reference</dt><dd className="font-mono text-xs font-medium">{sel.ref}</dd></div>
            <div className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">Dispatch date</dt><dd className="font-medium">{fmtDate(sel.dispatch)}</dd></div>
            <div className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">Expected arrival</dt><dd className={cn("font-medium", delayed && "text-destructive")}>{fmtDate(sel.arrival)}{delayed && " (+1 day)"}</dd></div>
          </dl>
        </Panel>
      </div>
    </div>
  );
}

function RouteMap({ from, to, progress, delayed }: { from: string; to: string; progress: number; delayed: boolean }) {
  const path = "M 40 150 C 140 40, 260 200, 360 90 S 520 60, 560 70";
  return (
    <div className="relative mt-5 overflow-hidden rounded-lg border bg-muted/40">
      <svg viewBox="0 0 600 200" className="h-[190px] w-full">
        <defs>
          <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="var(--border)" strokeWidth="1" /></pattern>
        </defs>
        <rect width="600" height="200" fill="url(#grid)" />
        <path d="M0 175 Q 150 160 300 182 T 600 168" fill="none" stroke="var(--border)" strokeWidth="10" strokeLinecap="round" opacity=".7" />
        <path d={path} fill="none" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
        <path d={path} fill="none" stroke={delayed ? "var(--destructive)" : "var(--primary)"} strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray={`${progress} 1`} />
        <path d={path} fill="none" stroke="var(--card)" strokeWidth="1.5" strokeDasharray="6 8" />
        {[0.33, 0.66].map((p) => <circle key={p} cx={p === 0.33 ? 222 : 380} cy={p === 0.33 ? 128 : 86} r="5" fill="var(--card)" stroke="var(--muted-foreground)" strokeWidth="2" />)}
        <circle cx="40" cy="150" r="9" fill="var(--success)" />
        <circle cx="560" cy="70" r="9" fill={progress >= 1 ? "var(--success)" : "var(--card)"} stroke="var(--success)" strokeWidth="3" />
      </svg>
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[11px] font-medium"><Warehouse className="size-3.5 text-success" />{from}</div>
      <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[11px] font-medium"><MapPin className="size-3.5 text-success" />{to}</div>
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[11px] text-muted-foreground"><Package className="size-3.5" />Checkpoints: Al Kharj · Hofuf</div>
      <div className={cn("absolute bottom-3 right-3 flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold", delayed ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground")}>
        <Truck className="size-3.5" />{Math.round(progress * 100)}% of route
      </div>
    </div>
  );
}
