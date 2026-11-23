import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Building2, CheckCircle2, AlertTriangle, Timer, Search, Star, MoreHorizontal, Eye, Mail, FileText, Plus } from "lucide-react";
import { PageHeader, StatCard, StatusBadge, ProgressBar, th, td } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { suppliers } from "@/data/printflow";
import { toast } from "sonner";

export const Route = createFileRoute("/suppliers/")({
  head: () => ({
    meta: [
      { title: "Supplier Management — PrintFlow" },
      { name: "description", content: "Directory of print, finishing, packaging and logistics suppliers with on-time delivery performance." },
      { property: "og:title", content: "Supplier Management — PrintFlow" },
      { property: "og:description", content: "Supplier directory and performance tracking." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const cats = [...new Set(suppliers.map((s) => s.category))];
  const rows = suppliers.filter((s) => (cat === "all" || s.category === cat) && [s.name, s.id, s.contact, s.location].some((v) => v.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Supplier Management" subtitle="Manage supplier relationships, capacity and delivery performance."
        actions={<Button size="sm" onClick={() => toast.success("Supplier onboarding form opened")}><Plus /> Add Supplier</Button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Suppliers" value="32" icon={Building2} tone="info" change={6.7} />
        <StatCard label="Active Suppliers" value="27" icon={CheckCircle2} tone="success" change={3.8} />
        <StatCard label="At Risk" value="03" icon={AlertTriangle} tone="warning" change={50} />
        <StatCard label="Average On-Time Delivery" value="91.5%" icon={Timer} tone="success" change={1.2} />
      </div>
      <div className="mt-6 rounded-xl border bg-card">
        <div className="flex flex-wrap gap-2 border-b p-4">
          <label className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search suppliers, contacts, cities" className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="h-9 w-[210px]"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All categories</SelectItem>{cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr>{["Supplier Name", "Supplier ID", "Category", "Contact Person", "Location", "Active Orders", "On-Time Delivery", "Rating", "Status", ""].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {rows.map((s) => (
                <tr key={s.id} onClick={() => navigate({ to: "/suppliers/$supplierId", params: { supplierId: s.id } })} className="cursor-pointer hover:bg-muted/40">
                  <td className={td}><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-lg bg-info-soft text-xs font-semibold text-primary">{s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span><span className="font-medium">{s.name}</span></div></td>
                  <td className={`${td} font-mono text-xs text-muted-foreground`}>{s.id}</td>
                  <td className={td}>{s.category}</td>
                  <td className={td}>{s.contact}</td>
                  <td className={`${td} text-muted-foreground`}>{s.location}</td>
                  <td className={`${td} tabular-nums`}>{s.activeOrders}</td>
                  <td className={td}><div className="flex w-32 items-center gap-2"><ProgressBar value={s.onTime} tone={s.onTime >= 92 ? "success" : s.onTime >= 86 ? "info" : "warning"} /><span className="text-xs font-medium tabular-nums">{s.onTime}%</span></div></td>
                  <td className={td}><span className="inline-flex items-center gap-1 text-sm font-medium"><Star className="size-3.5 fill-warning text-warning" />{s.rating.toFixed(1)}</span></td>
                  <td className={td}><StatusBadge status={s.status} /></td>
                  <td className={td} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="grid size-8 place-items-center rounded-md hover:bg-muted"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to="/suppliers/$supplierId" params={{ supplierId: s.id }}><Eye className="size-4" /> View profile</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success(`Email drafted to ${s.email}`)}><Mail className="size-4" /> Contact supplier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success(`New PO draft for ${s.name}`)}><FileText className="size-4" /> Create purchase order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
