import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Send, CheckCheck, PackageOpen, TimerOff, Plus, Check, Clock, Download } from "lucide-react";
import { PageHeader, StatCard, StatusBadge, th, td } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { fmtDate, purchaseOrders, sar, supplierById } from "@/data/printflow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/purchase-orders")({
  head: () => ({
    meta: [
      { title: "Purchase Orders — PrintFlow" },
      { name: "description", content: "Supplier purchase orders linked to customer orders, with values in SAR and delivery status." },
      { property: "og:title", content: "Purchase Orders — PrintFlow" },
      { property: "og:description", content: "Purchase order management across print suppliers." },
    ],
  }),
  component: POPage,
});

const statuses = ["All", "Draft", "Sent", "Acknowledged", "Partially Received", "Completed", "Delayed"];
type PO = (typeof purchaseOrders)[number];

function POPage() {
  const [tab, setTab] = useState("All");
  const [sel, setSel] = useState<PO | null>(null);
  const rows = purchaseOrders.filter((p) => tab === "All" || p.status === tab);
  const count = (s: string) => purchaseOrders.filter((p) => p.status === s).length;
  const total = purchaseOrders.reduce((a, b) => a + b.value, 0);

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Purchase Orders" subtitle="Raise, track and receive supplier purchase orders linked to customer orders."
        actions={<Button size="sm" onClick={() => toast.success("New purchase order draft created", { description: "PO-2026-0423" })}><Plus /> New Purchase Order</Button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Open PO value" value={sar(total)} icon={FileText} tone="info" />
        <StatCard label="Sent / awaiting ack." value={String(count("Sent")).padStart(2, "0")} icon={Send} tone="info" />
        <StatCard label="Acknowledged" value={String(count("Acknowledged")).padStart(2, "0")} icon={CheckCheck} tone="success" />
        <StatCard label="Partially received" value={String(count("Partially Received")).padStart(2, "0")} icon={PackageOpen} tone="warning" />
        <StatCard label="Delayed" value={String(count("Delayed")).padStart(2, "0")} icon={TimerOff} tone="danger" />
      </div>
      <div className="mt-6 rounded-xl border bg-card">
        <div className="flex gap-1 overflow-x-auto border-b px-3 pt-2">
          {statuses.map((s) => (
            <button key={s} onClick={() => setTab(s)} className={cn("-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-[13px] font-medium", tab === s ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {s} <span className="ml-1 rounded bg-muted px-1.5 text-[11px]">{s === "All" ? purchaseOrders.length : count(s)}</span>
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/40"><tr>{["PO Number", "Supplier", "Customer Order", "Item Description", "Quantity", "Value", "Order Date", "Expected", "Status"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {rows.map((p) => (
                <tr key={p.id} onClick={() => setSel(p)} className="cursor-pointer hover:bg-muted/40">
                  <td className={td}><span className="font-mono text-[13px] font-medium text-primary">{p.id}</span></td>
                  <td className={`${td} font-medium`}>{supplierById(p.supplier)?.name}</td>
                  <td className={`${td} font-mono text-xs`}>{p.order}</td>
                  <td className={`${td} max-w-[260px] truncate text-muted-foreground`}>{p.item}</td>
                  <td className={`${td} tabular-nums`}>{p.qty}</td>
                  <td className={`${td} font-medium tabular-nums`}>{sar(p.value)}</td>
                  <td className={`${td} tabular-nums text-muted-foreground`}>{fmtDate(p.date)}</td>
                  <td className={`${td} tabular-nums`}>{fmtDate(p.expected)}</td>
                  <td className={td}><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {sel && (() => {
            const s = supplierById(sel.supplier);
            const vat = Math.round(sel.value * 0.15);
            const approvals = [["Prepared by", "Lama Al-Saud", "Procurement Officer", true], ["Reviewed by", "Abdullah K.", "Operations Manager", sel.status !== "Draft"], ["Approved by", "Majed Al-Rasheed", "Finance Director", !["Draft", "Sent"].includes(sel.status)]] as const;
            return (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-2"><SheetTitle className="font-mono">{sel.id}</SheetTitle><StatusBadge status={sel.status} /></div>
                  <SheetDescription>Purchase order preview · linked to <Link to="/orders/$orderId" params={{ orderId: sel.order }} className="text-primary">{sel.order}</Link></SheetDescription>
                </SheetHeader>
                <div className="space-y-5 px-4 pb-6">
                  <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 text-sm">
                    <div><div className="text-xs text-muted-foreground">Supplier</div><div className="font-medium">{s?.name}</div><div className="text-xs text-muted-foreground">{s?.contact} · {s?.phone}</div><div className="text-xs text-muted-foreground">{s?.location}, KSA · CR {s?.cr}</div></div>
                    <div><div className="text-xs text-muted-foreground">Bill to</div><div className="font-medium">PrintFlow Manufacturing Co.</div><div className="text-xs text-muted-foreground">2nd Industrial City, Riyadh</div><div className="text-xs text-muted-foreground">VAT 300158842100003</div></div>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Line items</div>
                    <table className="w-full rounded-lg border text-sm">
                      <thead className="bg-muted/40"><tr><th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Description</th><th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Qty</th><th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Amount</th></tr></thead>
                      <tbody className="divide-y border-t">
                        <tr><td className="px-3 py-2">{sel.item}</td><td className="px-3 py-2 text-right">{sel.qty}</td><td className="px-3 py-2 text-right tabular-nums">{sar(Math.round(sel.value * 0.94))}</td></tr>
                        <tr><td className="px-3 py-2">Handling & delivery to site</td><td className="px-3 py-2 text-right">1 lot</td><td className="px-3 py-2 text-right tabular-nums">{sar(sel.value - Math.round(sel.value * 0.94))}</td></tr>
                      </tbody>
                      <tfoot className="border-t text-sm">
                        <tr><td colSpan={2} className="px-3 py-1.5 text-right text-muted-foreground">Subtotal</td><td className="px-3 py-1.5 text-right tabular-nums">{sar(sel.value)}</td></tr>
                        <tr><td colSpan={2} className="px-3 py-1.5 text-right text-muted-foreground">VAT 15%</td><td className="px-3 py-1.5 text-right tabular-nums">{sar(vat)}</td></tr>
                        <tr className="font-semibold"><td colSpan={2} className="px-3 py-2 text-right">Total</td><td className="px-3 py-2 text-right tabular-nums">{sar(sel.value + vat)}</td></tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="rounded-lg border p-4 text-sm">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Delivery instructions</div>
                    <p>Deliver to Receiving Bay 3 by {fmtDate(sel.expected, { month: "long", day: "2-digit", year: "numeric" })}, between 07:00–15:00. Palletised and shrink-wrapped; include delivery note referencing {sel.id}. Payment terms: Net 45.</p>
                  </div>
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approval status</div>
                    <ol className="space-y-2">
                      {approvals.map(([role, name, title, done]) => (
                        <li key={role} className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
                          <span className={cn("grid size-6 place-items-center rounded-full", done ? "bg-success text-primary-foreground" : "bg-muted text-muted-foreground")}>{done ? <Check className="size-3.5" /> : <Clock className="size-3.5" />}</span>
                          <div className="flex-1 text-sm"><span className="text-muted-foreground">{role}</span> · <span className="font-medium">{name}</span><div className="text-xs text-muted-foreground">{title}</div></div>
                          <span className={cn("text-xs font-medium", done ? "text-success" : "text-muted-foreground")}>{done ? "Approved" : "Pending"}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => toast.success(`${sel.id}.pdf downloaded`)}><Download /> Download PDF</Button>
                    <Button className="flex-1" onClick={() => toast.success(`${sel.id} sent to ${s?.email}`)}><Send /> Send to supplier</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
}
