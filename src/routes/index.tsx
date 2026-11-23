import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Clock, Factory, AlertTriangle, TimerOff, CheckCircle2, ArrowRight, Download, CalendarDays, AlertOctagon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from "recharts";
import { PageHeader, Panel, StatCard, StatusBadge, th, td } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { criticalAlerts, dashboardKpis, fmtDate, orders, statusDistribution, supplierPerformance, weeklyProduction } from "@/data/printflow";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Operations Overview — PrintFlow" },
      { name: "description", content: "Monitor production, supplier performance, order progress and delivery schedules across all print suppliers." },
      { property: "og:title", content: "Operations Overview — PrintFlow" },
      { property: "og:description", content: "Live operations dashboard for multi-supplier print and packaging production." },
    ],
  }),
  component: Dashboard,
});

const icons = { Package, Clock, Factory, AlertTriangle, TimerOff, CheckCircle2 };
export const tooltipStyle = { borderRadius: 8, border: "1px solid var(--border)", fontSize: 12, boxShadow: "0 4px 12px rgb(0 0 0 / 0.06)" };

function Dashboard() {
  const total = statusDistribution.reduce((a, b) => a + b.value, 0);
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Operations Overview"
        subtitle="Monitor production, supplier performance, order progress, and delivery schedules."
        actions={<>
          <Button variant="outline" size="sm"><CalendarDays /> Nov 1 – Nov 30, 2026</Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Operations report exported", { description: "PrintFlow_Operations_Nov2026.pdf" })}><Download /> Export</Button>
        </>}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {dashboardKpis.map((k) => (
          <StatCard key={k.label} label={k.label} value={k.value} icon={icons[k.icon as keyof typeof icons]} tone={k.tone} change={k.change} hint="vs. October 2026" />
        ))}
      </div>

      <section className="mt-6 overflow-hidden rounded-xl border border-destructive/25 bg-card">
        <header className="flex items-center justify-between border-b border-destructive/15 bg-danger-soft px-5 py-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="size-[18px] text-destructive" />
            <h2 className="text-sm font-semibold">Attention Required</h2>
            <span className="rounded-full bg-destructive px-2 text-[11px] font-semibold text-destructive-foreground">3</span>
          </div>
          <span className="text-xs text-muted-foreground">Updated 12 min ago</span>
        </header>
        <div className="grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          {criticalAlerts.map((a) => (
            <div key={a.order} className="flex flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[13px] font-semibold">#{a.order}</span>
                <StatusBadge status={`${a.priority} Priority`} tone={a.priority === "High" ? "danger" : "warning"} />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">Supplier</div>
              <div className="text-sm font-medium">{a.supplier}</div>
              <div className="mt-3 text-sm">{a.issue}</div>
              <div className="mt-1 text-xs text-muted-foreground"><span className="font-medium text-foreground">Impact:</span> {a.impact}</div>
              <div className="mt-4 pt-1">
                <Button asChild variant="outline" size="sm">
                  <Link to="/orders/$orderId" params={{ orderId: a.order }}>View Details <ArrowRight /></Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Order Status Distribution" subtitle={`${total} orders currently tracked`}>
          <div className="flex flex-col items-center gap-4 sm:flex-row xl:flex-col 2xl:flex-row">
            <div className="relative h-[170px] w-[170px] shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={statusDistribution} dataKey="value" innerRadius={54} outerRadius={80} paddingAngle={2} stroke="none">
                    {statusDistribution.map((d) => <Cell key={d.name} fill={d.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                <div><div className="text-2xl font-semibold">{total}</div><div className="text-[11px] text-muted-foreground">Orders</div></div>
              </div>
            </div>
            <ul className="grid w-full flex-1 grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-1">
              {statusDistribution.map((d) => (
                <li key={d.name} className="flex items-center gap-2 text-[13px]">
                  <span className="size-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="flex-1 truncate text-muted-foreground">{d.name}</span>
                  <span className="font-medium tabular-nums">{d.value}</span>
                  <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{Math.round((d.value / total) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Production Overview" subtitle="Weekly planned vs. completed orders">
          <div className="h-[220px]">
            <ResponsiveContainer>
              <BarChart data={weeklyProduction} barGap={4}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tickFormatter={(v: string) => v.split(" · ")[0] ?? v} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="planned" name="Planned" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Supplier Performance" subtitle="On-time delivery rate, last 90 days" actions={<Link to="/suppliers" className="text-xs font-medium text-primary">View all</Link>}>
          <div className="h-[220px]">
            <ResponsiveContainer>
              <BarChart data={supplierPerformance} layout="vertical" margin={{ right: 36 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={84} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v: number, _n, p) => [`${v}%`, (p.payload as { full: string }).full]} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} background={{ fill: "var(--muted)", radius: 4 }}>
                  {supplierPerformance.map((s) => <Cell key={s.name} fill={s.value >= 95 ? "var(--success)" : s.value >= 88 ? "var(--primary)" : "var(--warning)"} />)}
                  <LabelList dataKey="value" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 12, fontWeight: 600, fill: "var(--foreground)" }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel className="mt-6" title="Order Timeline" subtitle="Most recent orders across all customers" bodyClassName="p-0" actions={<Link to="/orders" className="text-xs font-medium text-primary">View all orders</Link>}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr>
              {["Order ID", "Customer", "Product", "Current Stage", "Expected Delivery", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}
            </tr></thead>
            <tbody className="divide-y">
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="hover:bg-muted/40">
                  <td className={td}><Link to="/orders/$orderId" params={{ orderId: o.id }} className="font-mono text-[13px] font-medium text-primary hover:underline">{o.id}</Link></td>
                  <td className={td}>{o.customer}</td>
                  <td className={`${td} text-muted-foreground`}>{o.product}</td>
                  <td className={td}>{o.stage}</td>
                  <td className={`${td} tabular-nums`}>{fmtDate(o.delivery)}</td>
                  <td className={td}><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
