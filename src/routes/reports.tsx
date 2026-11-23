import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, CheckCircle2, TimerOff, Target, Download, Truck, Clock, Hourglass } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { PageHeader, Panel, StatCard } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { suppliers } from "@/data/printflow";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — PrintFlow" },
      { name: "description", content: "Executive reporting on order performance, supplier analytics, production bottlenecks and delivery." },
      { property: "og:title", content: "Reports & Analytics — PrintFlow" },
      { property: "og:description", content: "Executive analytics for print and packaging operations." },
    ],
  }),
  component: ReportsPage,
});

const tip = { borderRadius: 8, fontSize: 12, border: "1px solid var(--border)" };
const axis = { fontSize: 11, fill: "var(--muted-foreground)" };
const monthly = [
  { m: "Jun", orders: 108, completed: 101, revenue: 2.9 }, { m: "Jul", orders: 96, completed: 92, revenue: 2.6 }, { m: "Aug", orders: 121, completed: 112, revenue: 3.2 },
  { m: "Sep", orders: 134, completed: 126, revenue: 3.6 }, { m: "Oct", orders: 142, completed: 131, revenue: 3.9 }, { m: "Nov", orders: 156, completed: 126, revenue: 4.3 },
];
const supplierData = suppliers.slice(0, 6).map((s, i) => ({ name: s.name.split(" ").slice(0, 2).join(" "), onTime: s.onTime, quality: s.qualityScore, delays: [1, 7, 3, 4, 1, 2][i] ?? 0, turnaround: s.avgTurnaround }));
const bottlenecks = [
  { stage: "Approval", planned: 1.5, actual: 2.1 }, { stage: "Procurement", planned: 2.5, actual: 2.8 }, { stage: "Printing", planned: 3, actual: 4.2 },
  { stage: "Finishing", planned: 2, actual: 2.6 }, { stage: "QC", planned: 1, actual: 1.1 }, { stage: "Dispatch", planned: 1, actual: 1.3 },
];
const delivery = [{ name: "On time", value: 89, color: "var(--success)" }, { name: "1 day late", value: 7, color: "var(--warning)" }, { name: "2+ days late", value: 4, color: "var(--destructive)" }];
const onTimeTrend = [{ w: "W43", r: 87 }, { w: "W44", r: 90 }, { w: "W45", r: 88 }, { w: "W46", r: 92 }, { w: "W47", r: 86 }, { w: "W48", r: 89 }];

function ReportsPage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Reports & Analytics" subtitle="Executive view of order, supplier, production and delivery performance."
        actions={<>
          <Select defaultValue="6m"><SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30d">Last 30 days</SelectItem><SelectItem value="6m">Last 6 months</SelectItem><SelectItem value="ytd">Year to date</SelectItem></SelectContent></Select>
          <Button size="sm" onClick={() => toast.success("Executive report generated", { description: "PrintFlow_Executive_Report_Nov2026.pdf" })}><Download /> Export report</Button>
        </>} />

      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order performance</h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Orders (6 mo.)" value="757" icon={ClipboardList} tone="info" change={14.2} />
        <StatCard label="Completed Orders" value="688" icon={CheckCircle2} tone="success" change={11.8} />
        <StatCard label="Delayed Orders" value="23" icon={TimerOff} tone="danger" change={-8.0} />
        <StatCard label="On-Time Completion Rate" value="93.4%" icon={Target} tone="success" change={1.9} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Monthly Order Volume" subtitle="Orders received vs. completed">
          <div className="h-[260px]"><ResponsiveContainer>
            <AreaChart data={monthly}>
              <defs><linearGradient id="g1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity={0.25} /><stop offset="1" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="m" tick={axis} axisLine={false} tickLine={false} /><YAxis tick={axis} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={tip} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="orders" name="Received" stroke="var(--primary)" strokeWidth={2.5} fill="url(#g1)" />
              <Line type="monotone" dataKey="completed" name="Completed" stroke="var(--success)" strokeWidth={2} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="var(--success)" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer></div>
        </Panel>
        <Panel title="Stage-wise Bottlenecks" subtitle="Average days per stage: planned vs. actual">
          <div className="h-[260px]"><ResponsiveContainer>
            <BarChart data={bottlenecks} barGap={3}>
              <CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="stage" tick={axis} axisLine={false} tickLine={false} /><YAxis tick={axis} axisLine={false} tickLine={false} width={28} unit="d" />
              <Tooltip contentStyle={tip} cursor={{ fill: "var(--muted)" }} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="planned" name="Planned" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={20} />
              <Bar dataKey="actual" name="Actual" radius={[4, 4, 0, 0]} maxBarSize={20}>
                {bottlenecks.map((b) => <Cell key={b.stage} fill={b.actual / b.planned > 1.3 ? "var(--destructive)" : "var(--primary)"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer></div>
        </Panel>
      </div>

      <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supplier analytics</h3>
      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Supplier Delivery & Quality" subtitle="On-time delivery rate and quality rating by supplier">
          <div className="h-[280px]"><ResponsiveContainer>
            <BarChart data={supplierData} barGap={3}>
              <CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="name" tick={axis} axisLine={false} tickLine={false} interval={0} /><YAxis domain={[70, 100]} tick={axis} axisLine={false} tickLine={false} width={32} unit="%" />
              <Tooltip contentStyle={tip} cursor={{ fill: "var(--muted)" }} /><Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="onTime" name="On-time %" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={22} />
              <Bar dataKey="quality" name="Quality %" fill="var(--success)" radius={[4, 4, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer></div>
        </Panel>
        <Panel title="Delay Frequency & Turnaround" subtitle="Last 90 days" bodyClassName="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/40"><tr><th className="px-4 py-2 text-left text-[11px] font-semibold uppercase text-muted-foreground">Supplier</th><th className="px-4 py-2 text-right text-[11px] font-semibold uppercase text-muted-foreground">Delays</th><th className="px-4 py-2 text-right text-[11px] font-semibold uppercase text-muted-foreground">Avg TAT</th></tr></thead>
            <tbody className="divide-y">{supplierData.map((s) => (
              <tr key={s.name}><td className="px-4 py-2.5">{s.name}</td><td className={`px-4 py-2.5 text-right font-semibold tabular-nums ${s.delays >= 5 ? "text-destructive" : s.delays >= 3 ? "text-warning" : ""}`}>{s.delays}</td><td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{s.turnaround} d</td></tr>
            ))}</tbody>
          </table>
        </Panel>
      </div>

      <h3 className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Production & delivery analytics</h3>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Avg. production time" value="11.2 days" icon={Hourglass} tone="info" change={-4.3} />
        <StatCard label="On-time delivery rate" value="89%" icon={Truck} tone="success" change={2.1} />
        <StatCard label="Delayed shipments (Nov)" value="07" icon={TimerOff} tone="danger" change={-22.2} />
        <StatCard label="Avg. delivery turnaround" value="1.4 days" icon={Clock} tone="neutral" change={-6.7} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Delivery Punctuality" subtitle="November shipments">
          <div className="flex items-center gap-4">
            <div className="h-[180px] w-[180px] shrink-0"><ResponsiveContainer><PieChart><Pie data={delivery} dataKey="value" innerRadius={55} outerRadius={82} paddingAngle={2} stroke="none">{delivery.map((d) => <Cell key={d.name} fill={d.color} />)}</Pie><Tooltip contentStyle={tip} /></PieChart></ResponsiveContainer></div>
            <ul className="flex-1 space-y-2.5">{delivery.map((d) => <li key={d.name} className="flex items-center gap-2 text-[13px]"><span className="size-2.5 rounded-sm" style={{ background: d.color }} /><span className="flex-1 text-muted-foreground">{d.name}</span><span className="font-semibold">{d.value}%</span></li>)}</ul>
          </div>
        </Panel>
        <Panel className="xl:col-span-2" title="On-time Delivery Trend" subtitle="Weekly %, target 92%">
          <div className="h-[200px]"><ResponsiveContainer>
            <LineChart data={onTimeTrend}><CartesianGrid vertical={false} stroke="var(--border)" /><XAxis dataKey="w" tick={axis} axisLine={false} tickLine={false} /><YAxis domain={[80, 100]} tick={axis} axisLine={false} tickLine={false} width={32} unit="%" /><Tooltip contentStyle={tip} />
              <Line type="monotone" dataKey="r" name="On-time" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--card)", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer></div>
        </Panel>
      </div>
    </div>
  );
}
