import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, Hourglass, CheckCircle2, XCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { PageHeader, Panel, StatCard, StatusBadge, ProgressBar, th, td } from "@/components/pf/ui";
import { fmtDate, inspections } from "@/data/printflow";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality Control — PrintFlow" },
      { name: "description", content: "Quality inspection results, pass rates and defect trends across print orders." },
      { property: "og:title", content: "Quality Control — PrintFlow" },
      { property: "og:description", content: "Quality inspection management for print and packaging." },
    ],
  }),
  component: QualityPage,
});

const trend = [
  { week: "W44", passed: 21, failed: 1 }, { week: "W45", passed: 24, failed: 2 }, { week: "W46", passed: 26, failed: 1 },
  { week: "W47", passed: 23, failed: 3 }, { week: "W48", passed: 18, failed: 1 },
];

function QualityPage() {
  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Quality Control" subtitle="Inspection outcomes, defect trends and pending quality sign-offs." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Pending Inspections" value="06" icon={Hourglass} tone="warning" />
        <StatCard label="Completed Inspections" value="112" icon={ClipboardCheck} tone="info" change={8.7} />
        <StatCard label="Passed" value="104" icon={CheckCircle2} tone="success" change={9.5} hint="92.9% first-pass yield" />
        <StatCard label="Failed" value="08" icon={XCircle} tone="danger" change={-11.1} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title="Inspection Outcomes" subtitle="Weekly passed vs. failed inspections">
          <div className="h-[240px]">
            <ResponsiveContainer>
              <BarChart data={trend}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} cursor={{ fill: "var(--muted)" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="passed" name="Passed" stackId="a" fill="var(--success)" maxBarSize={36} />
                <Bar dataKey="failed" name="Failed" stackId="a" fill="var(--destructive)" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Top Defect Categories" subtitle="November 2026">
          <ul className="space-y-4">
            {[["Colour deviation", 38, "danger"], ["Registration offset", 24, "warning"], ["Lamination bubbles", 17, "warning"], ["Die-cut misalignment", 12, "info"], ["Packing damage", 9, "neutral"]].map(([n, v, t]) => (
              <li key={n as string}><div className="mb-1.5 flex justify-between text-[13px]"><span>{n}</span><span className="font-medium">{v}%</span></div><ProgressBar value={(v as number) * 2.2} tone={t as "info"} /></li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel className="mt-6" title="Inspections" subtitle="Click an inspection to open its checklist" bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr>{["Inspection ID", "Order ID", "Product", "Qty Inspected", "Quality Inspector", "Inspection Date", "Result"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {inspections.map((i) => (
                <tr key={i.id} className="hover:bg-muted/40">
                  <td className={td}><Link to="/inspections" search={{ id: i.id }} className="font-mono text-[13px] font-medium text-primary hover:underline">{i.id}</Link></td>
                  <td className={td}><Link to="/orders/$orderId" params={{ orderId: i.order }} className="font-mono text-xs hover:text-primary">{i.order}</Link></td>
                  <td className={td}>{i.product}</td>
                  <td className={`${td} tabular-nums`}>{i.qty.toLocaleString()} units</td>
                  <td className={td}>{i.inspector}</td>
                  <td className={`${td} tabular-nums text-muted-foreground`}>{fmtDate(i.date)}</td>
                  <td className={td}><StatusBadge status={i.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
