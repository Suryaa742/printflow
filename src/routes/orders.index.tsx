import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ClipboardList, Loader2, Clock, TimerOff, Plus, Search, ArrowUpDown, MoreHorizontal, Eye, Pencil, Copy, XCircle, Download } from "lucide-react";
import { PageHeader, StatCard, StatusBadge, th, td } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fmtDate, orders as seed, type Order } from "@/data/printflow";
import { CreateOrderDialog } from "@/components/pf/create-order-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Orders — PrintFlow" },
      { name: "description", content: "Manage all customer print and packaging orders, suppliers, stages and delivery dates." },
      { property: "og:title", content: "Orders — PrintFlow" },
      { property: "og:description", content: "Customer order management for print and packaging production." },
    ],
  }),
  component: OrdersPage,
});

type SortKey = "id" | "customer" | "quantity" | "orderDate" | "delivery";
const PAGE = 8;

function OrdersPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Order[]>(seed);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [window, setWindow] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "id", dir: -1 });
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const r = rows.filter((o) => {
      const s = q.toLowerCase();
      if (s && ![o.id, o.customer, o.product].some((v) => v.toLowerCase().includes(s))) return false;
      if (status !== "all" && o.status !== status) return false;
      if (priority !== "all" && o.priority !== priority) return false;
      if (window === "nov" && !o.delivery.startsWith("2026-11")) return false;
      if (window === "w1" && !(o.delivery >= "2026-12-01" && o.delivery <= "2026-12-05")) return false;
      if (window === "w2" && !(o.delivery > "2026-12-05")) return false;
      return true;
    });
    return [...r].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : -1) * sort.dir);
  }, [rows, q, status, priority, window, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const view = filtered.slice((page - 1) * PAGE, page * PAGE);
  const toggleSort = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }));
  const SortTh = ({ k, children }: { k: SortKey; children: string }) => (
    <th className={th}><button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 uppercase hover:text-foreground">{children}<ArrowUpDown className="size-3" /></button></th>
  );

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Orders" subtitle="Track every customer order from artwork approval through final delivery."
        actions={<>
          <Button variant="outline" size="sm" onClick={() => toast.success("Orders exported", { description: `${filtered.length} records · Orders_Nov2026.xlsx` })}><Download /> Export</Button>
          <Button size="sm" onClick={() => setOpen(true)}><Plus /> Create New Order</Button>
        </>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="All Orders" value="156" icon={ClipboardList} tone="info" change={9.1} />
        <StatCard label="In Progress" value="48" icon={Loader2} tone="info" change={8.4} />
        <StatCard label="Pending Approval" value="07" icon={Clock} tone="warning" change={-12.5} />
        <StatCard label="Delayed" value="03" icon={TimerOff} tone="danger" change={-25} />
      </div>

      <div className="mt-6 rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          <label className="relative min-w-[240px] flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search by order ID, customer or product"
              className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {["In Progress", "At Risk", "Delayed", "Pending", "Completed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => { setPriority(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {["High", "Medium", "Low"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={window} onValueChange={(v) => { setWindow(v); setPage(1); }}>
            <SelectTrigger className="h-9 w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any delivery date</SelectItem>
              <SelectItem value="nov">Due in November</SelectItem>
              <SelectItem value="w1">Dec 01 – Dec 05</SelectItem>
              <SelectItem value="w2">After Dec 05</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr>
              <SortTh k="id">Order ID</SortTh><SortTh k="customer">Customer Name</SortTh><th className={th}>Product / Project</th>
              <SortTh k="quantity">Quantity</SortTh><SortTh k="orderDate">Order Date</SortTh><SortTh k="delivery">Expected Delivery</SortTh>
              <th className={th}>Suppliers</th><th className={th}>Current Stage</th><th className={th}>Priority</th><th className={th}>Status</th><th className={th} />
            </tr></thead>
            <tbody className="divide-y">
              {view.map((o) => (
                <tr key={o.id} onClick={() => navigate({ to: "/orders/$orderId", params: { orderId: o.id } })} className="cursor-pointer hover:bg-muted/40">
                  <td className={td}><span className="font-mono text-[13px] font-medium text-primary">{o.id}</span></td>
                  <td className={`${td} font-medium`}>{o.customer}</td>
                  <td className={`${td} text-muted-foreground`}>{o.product}</td>
                  <td className={`${td} tabular-nums`}>{o.quantity.toLocaleString()} Units</td>
                  <td className={`${td} tabular-nums text-muted-foreground`}>{fmtDate(o.orderDate)}</td>
                  <td className={`${td} tabular-nums`}>{fmtDate(o.delivery)}</td>
                  <td className={td}><span className="rounded-md bg-muted px-2 py-0.5 text-xs">{o.suppliers.length} Suppliers</span></td>
                  <td className={td}>{o.stage}</td>
                  <td className={td}><StatusBadge status={o.priority} /></td>
                  <td className={td}><StatusBadge status={o.status} /></td>
                  <td className={td} onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="grid size-8 place-items-center rounded-md hover:bg-muted" aria-label="Actions"><MoreHorizontal className="size-4" /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to="/orders/$orderId" params={{ orderId: o.id }}><Eye className="size-4" /> View details</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Edit mode opened", { description: o.id })}><Pencil className="size-4" /> Edit order</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success(`${o.id} duplicated as draft`)}><Copy className="size-4" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => toast.error(`Cancellation request raised for ${o.id}`)}><XCircle className="size-4" /> Cancel order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {view.length === 0 && <tr><td colSpan={11} className="py-12 text-center text-sm text-muted-foreground">No orders match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>Showing {filtered.length ? (page - 1) * PAGE + 1 : 0}–{Math.min(page * PAGE, filtered.length)} of {filtered.length} orders</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            {Array.from({ length: pages }, (_, i) => (
              <Button key={i} variant={page === i + 1 ? "default" : "ghost"} size="sm" className="w-8" onClick={() => setPage(i + 1)}>{i + 1}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <CreateOrderDialog open={open} onOpenChange={setOpen} nextId={`PF-2026-0${164 + rows.length - seed.length}`}
        onCreate={(o) => { setRows((r) => [o, ...r]); setSort({ key: "id", dir: -1 }); setPage(1); }} />
    </div>
  );
}
