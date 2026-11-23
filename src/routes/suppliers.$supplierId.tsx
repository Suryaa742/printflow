import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, Star, FileText, Calendar, Hash } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
import { Panel, StatCard, StatusBadge, th, td } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { fmtDate, orders, purchaseOrders, sar, supplierById } from "@/data/printflow";
import { Timer, Package, Award, Hourglass } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/suppliers/$supplierId")({
  loader: ({ params }) => {
    const supplier = supplierById(params.supplierId);
    if (!supplier) throw notFound();
    return { supplier };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.supplier.name} — PrintFlow` : "Supplier — PrintFlow" },
      { name: "description", content: loaderData ? `${loaderData.supplier.category} supplier in ${loaderData.supplier.location}: orders, POs and delivery performance.` : "Supplier profile" },
      { property: "og:title", content: loaderData ? `${loaderData.supplier.name} — PrintFlow` : "Supplier — PrintFlow" },
      { property: "og:description", content: "Supplier profile and performance history." },
    ],
  }),
  notFoundComponent: () => <div className="p-10 text-center text-sm text-muted-foreground">Supplier not found. <Link to="/suppliers" className="text-primary">Back</Link></div>,
  component: SupplierDetail,
});

const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

function SupplierDetail() {
  const { supplier: s } = Route.useLoaderData();
  const assigned = orders.filter((o) => o.suppliers.includes(s.id));
  const pos = purchaseOrders.filter((p) => p.supplier === s.id);
  const seed = s.id.charCodeAt(7);
  const history = months.map((m, i) => ({ month: m, onTime: Math.min(100, Math.round(s.onTime + ((seed * (i + 3)) % 9) - 4 + (i === 5 ? (s.onTime < 85 ? -3 : 1) : 0))), quality: Math.min(100, s.qualityScore - 2 + ((seed + i) % 4)) }));
  const delayed = s.onTime < 90
    ? [["PO-2026-0413", "PF-2026-0148", "Nov 24", "Nov 26", "2 days", "Machine maintenance"], ["PO-2026-0377", "PF-2026-0131", "Nov 09", "Nov 11", "2 days", "Paper shortage"], ["PO-2026-0342", "PF-2026-0117", "Oct 28", "Oct 29", "1 day", "Labour shortage"]]
    : [["PO-2026-0359", "PF-2026-0122", "Nov 02", "Nov 03", "1 day", "Customs clearance"]];

  return (
    <div className="mx-auto max-w-[1600px]">
      <Link to="/suppliers" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to suppliers</Link>
      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span className="grid size-16 place-items-center rounded-xl bg-info-soft text-xl font-semibold text-primary">{s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2.5"><h1 className="text-2xl font-semibold tracking-tight">{s.name}</h1><StatusBadge status={s.status} /></div>
            <p className="mt-1 text-sm text-muted-foreground">{s.category} · {s.short} · Partner since {s.since}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5"><Mail className="size-4 text-muted-foreground" />{s.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="size-4 text-muted-foreground" />{s.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-4 text-muted-foreground" />{s.location}, Saudi Arabia</span>
              <span className="flex items-center gap-1.5"><Hash className="size-4 text-muted-foreground" />CR {s.cr}</span>
              <span className="flex items-center gap-1.5"><Star className="size-4 fill-warning text-warning" />{s.rating.toFixed(1)} rating</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success(`Message sent to ${s.contact}`)}><Mail /> Contact {s.contact.split(" ")[0]}</Button>
            <Button size="sm" onClick={() => toast.success(`New PO draft for ${s.name}`)}><FileText /> New PO</Button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="On-time delivery" value={`${s.onTime}%`} icon={Timer} tone={s.onTime >= 90 ? "success" : "warning"} change={s.onTime >= 90 ? 1.4 : -3.6} />
        <StatCard label="Active orders" value={String(s.activeOrders)} icon={Package} tone="info" />
        <StatCard label="Quality score" value={`${s.qualityScore}%`} icon={Award} tone="success" />
        <StatCard label="Avg. turnaround" value={`${s.avgTurnaround} days`} icon={Hourglass} tone="neutral" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Historical Performance" subtitle="On-time delivery and quality score, last 6 months">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <LineChart data={history}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={30} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <ReferenceLine y={90} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: "Target 90%", fontSize: 10, fill: "var(--muted-foreground)", position: "insideTopLeft" }} />
                <Line type="monotone" dataKey="onTime" name="On-time %" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="quality" name="Quality %" stroke="var(--success)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Recent Activity">
          <ol className="relative space-y-4 before:absolute before:bottom-1 before:left-[5px] before:top-1 before:w-px before:bg-border">
            {[["Nov 26", "Delivery status updated on " + (pos[0]?.id ?? "PO-2026-0399")], ["Nov 24", "Production started on assigned order"], ["Nov 22", "Purchase order acknowledged"], ["Nov 18", "Quarterly performance review completed"], ["Nov 10", "Updated trade licence uploaded"]].map(([d, t]) => (
              <li key={t} className="relative pl-6"><span className="absolute left-0 top-1.5 size-[11px] rounded-full bg-primary ring-4 ring-card" /><div className="text-[11px] text-muted-foreground"><Calendar className="mr-1 inline size-3" />{d}</div><div className="text-[13px]">{t}</div></li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Assigned Orders" subtitle={`${assigned.length} customer orders`} bodyClassName="p-0">
          <table className="w-full"><thead className="border-b bg-muted/40"><tr>{["Order", "Customer", "Stage", "Due", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y">{assigned.map((o) => (
              <tr key={o.id} className="hover:bg-muted/40"><td className={td}><Link to="/orders/$orderId" params={{ orderId: o.id }} className="font-mono text-xs font-medium text-primary">{o.id}</Link></td><td className={td}>{o.customer}</td><td className={td}>{o.stage}</td><td className={`${td} tabular-nums`}>{fmtDate(o.delivery, { month: "short", day: "2-digit" })}</td><td className={td}><StatusBadge status={o.status} /></td></tr>
            ))}</tbody></table>
        </Panel>
        <div className="space-y-6">
          <Panel title="Active Purchase Orders" bodyClassName="p-0">
            <table className="w-full"><thead className="border-b bg-muted/40"><tr>{["PO", "Item", "Value", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody className="divide-y">{(pos.length ? pos : purchaseOrders.slice(0, 2)).map((p) => (
                <tr key={p.id}><td className={`${td} font-mono text-xs`}>{p.id}</td><td className={`${td} max-w-[220px] truncate`}>{p.item}</td><td className={`${td} tabular-nums`}>{sar(p.value)}</td><td className={td}><StatusBadge status={p.status} /></td></tr>
              ))}</tbody></table>
          </Panel>
          <Panel title="Delayed Deliveries" subtitle="Last 60 days" bodyClassName="p-0">
            <table className="w-full"><thead className="border-b bg-muted/40"><tr>{["PO", "Order", "Planned", "Actual", "Delay", "Reason"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody className="divide-y">{delayed.map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`${td} ${i === 4 ? "font-semibold text-destructive" : ""} ${i < 2 ? "font-mono text-xs" : ""}`}>{c}</td>)}</tr>)}</tbody></table>
          </Panel>
        </div>
      </div>
    </div>
  );
}
