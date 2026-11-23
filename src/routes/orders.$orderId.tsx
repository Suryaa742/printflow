import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, AlertTriangle, Clock, Circle, Building2, FileText, FileImage, FileSpreadsheet, Download, Mail, Lightbulb, ArrowRight, CalendarClock, Printer, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Panel, StatusBadge, toneClasses } from "@/components/pf/ui";
import { fmtDate, orderById, sar, supplierById, type Order, type Tone } from "@/data/printflow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/orders/$orderId")({
  loader: ({ params }) => {
    const order = orderById(params.orderId);
    if (!order) throw notFound();
    return { order };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Order ${loaderData.order.id} — PrintFlow` : "Order — PrintFlow" },
      { name: "description", content: loaderData ? `${loaderData.order.product} for ${loaderData.order.customer}: production stages, suppliers and delivery risk.` : "Order details" },
      { property: "og:title", content: loaderData ? `Order ${loaderData.order.id} — PrintFlow` : "Order — PrintFlow" },
      { property: "og:description", content: "Detailed production tracking and supplier dependencies for a print order." },
    ],
  }),
  notFoundComponent: () => <div className="p-10 text-center text-sm text-muted-foreground">Order not found. <Link to="/orders" className="text-primary">Back to orders</Link></div>,
  component: OrderDetail,
});

type StepState = "Completed" | "Delayed" | "At Risk" | "Pending" | "In Progress";
const STEPS = ["Order Received", "Artwork Approval", "Material Procurement", "Printing", "Lamination & Finishing", "Quality Inspection", "Packing & Dispatch", "Final Delivery"];
const stageIndex: Record<string, number> = { "Awaiting Approval": 1, "Material Procurement": 2, Printing: 3, Finishing: 4, "Quality Inspection": 5, "Ready for Dispatch": 6, Delivered: 8 };

interface Alloc { supplierId: string; responsibility: string; status: StepState; planned: string; actual?: string | undefined; revised?: string | undefined; delay?: number; start: string; end: string; plannedEnd: string }

function buildDetail(o: Order) {
  if (o.id === "PF-2026-0148") {
    return {
      product: "Branded Promotional Packaging Kits",
      steps: ["Completed", "Completed", "Completed", "Delayed", "At Risk", "Pending", "Pending", "Pending"] as StepState[],
      allocs: [
        { supplierId: "SUP-1001", responsibility: "Raw Material Procurement", status: "Completed", planned: "2026-11-23", actual: "2026-11-23", start: "2026-11-21", end: "2026-11-23", plannedEnd: "2026-11-23" },
        { supplierId: "SUP-1002", responsibility: "Printing", status: "Delayed", planned: "2026-11-24", revised: "2026-11-26", delay: 2, start: "2026-11-24", end: "2026-11-26", plannedEnd: "2026-11-24" },
        { supplierId: "SUP-1003", responsibility: "Lamination & Finishing", status: "At Risk", planned: "2026-11-28", revised: "2026-11-30", start: "2026-11-27", end: "2026-11-30", plannedEnd: "2026-11-28" },
        { supplierId: "SUP-1004", responsibility: "Packing and Delivery", status: "Pending", planned: "2026-12-01", revised: "2026-12-03", start: "2026-12-01", end: "2026-12-03", plannedEnd: "2026-12-01" },
      ] as Alloc[],
      timeline: [
        ["Nov 18", "Order created", "Sales order SO-88214 confirmed by Al Noor Retail Group procurement.", "success"],
        ["Nov 19", "Artwork submitted for approval", "Dieline v2 and print-ready PDF uploaded by studio.", "info"],
        ["Nov 20", "Artwork approved", "Approved by Huda Al-Rashid (Brand Manager, Al Noor).", "success"],
        ["Nov 21", "Purchase order sent to Supplier A", "PO-2026-0412 issued to Royal Paper Industries · SAR 92,500.", "info"],
        ["Nov 23", "Raw materials received", "18,500 sheets SBS 350gsm received at Jeddah print site.", "success"],
        ["Nov 24", "Printing production started", "Gulf Print Solutions started run on Heidelberg XL-106.", "info"],
        ["Nov 25", "Supplier reported machine maintenance issue", "Feeder unit failure; technician ETA 24 hrs.", "warning"],
        ["Nov 26", "Production delay identified and escalated", "Escalated to Abdullah (Operations Manager). Risk flag raised.", "danger"],
      ] as [string, string, string, Tone][],
      risk: true,
    };
  }
  const idx = stageIndex[o.stage] ?? 2;
  const steps = STEPS.map((_, i): StepState => i < idx ? "Completed" : i === idx ? (o.status === "Delayed" ? "Delayed" : o.status === "At Risk" ? "At Risk" : "In Progress") : "Pending");
  const resp = ["Raw Material Procurement", "Printing", "Lamination & Finishing", "Packing and Delivery"];
  const d0 = new Date(o.orderDate + "T00:00:00").getTime();
  const span = (new Date(o.delivery + "T00:00:00").getTime() - d0) / 86400000;
  const iso = (days: number) => new Date(d0 + days * 86400000).toISOString().slice(0, 10);
  const allocs: Alloc[] = o.suppliers.map((sid, i) => {
    const s = Math.round(span * (0.15 + i * 0.22)), e = Math.round(span * (0.3 + i * 0.22));
    const stepFor = Math.min(2 + i, 7);
    const st = steps[stepFor] ?? "Pending";
    return { supplierId: sid, responsibility: resp[i] ?? "Support", status: st, planned: iso(e), actual: st === "Completed" ? iso(e) : undefined, start: iso(s), end: iso(e), plannedEnd: iso(e) };
  });
  return {
    product: o.product, steps, allocs, risk: false,
    timeline: [
      [fmtDate(o.orderDate, { month: "short", day: "2-digit" }), "Order created", `Order confirmed by ${o.customer}.`, "success"],
      [fmtDate(iso(1), { month: "short", day: "2-digit" }), "Artwork submitted for approval", "Print-ready files uploaded.", "info"],
      ...(idx > 1 ? [[fmtDate(iso(2), { month: "short", day: "2-digit" }), "Artwork approved", "Customer sign-off received.", "success"]] : []),
      ...(idx > 2 ? [[fmtDate(iso(4), { month: "short", day: "2-digit" }), "Materials received", "Stock checked into production.", "success"]] : []),
      [fmtDate("2026-11-23", { month: "short", day: "2-digit" }), `Current stage: ${o.stage}`, `Status reported as ${o.status}.`, o.status === "Delayed" ? "danger" : o.status === "At Risk" ? "warning" : "info"],
    ] as [string, string, string, Tone][],
  };
}

const stepStyle: Record<StepState, { tone: Tone; icon: typeof Check }> = {
  Completed: { tone: "success", icon: Check }, Delayed: { tone: "danger", icon: AlertTriangle }, "At Risk": { tone: "warning", icon: Clock },
  "In Progress": { tone: "info", icon: Circle }, Pending: { tone: "neutral", icon: Circle },
};

function OrderDetail() {
  const { order } = Route.useLoaderData();
  const d = buildDetail(order);

  return (
    <div className="mx-auto max-w-[1600px]">
      <Link to="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to orders</Link>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-mono text-2xl font-semibold tracking-tight">{order.id}</h1>
              <StatusBadge status={order.status} />
              <StatusBadge status={`${order.priority} Priority`} tone={order.priority === "High" ? "danger" : order.priority === "Medium" ? "warning" : "neutral"} />
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">{d.product} · {order.customer}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.success("Order sheet sent to printer")}><Printer /> Print</Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Customer update drafted", { description: `To: procurement@${order.customer.split(" ")[0]?.toLowerCase()}.sa` })}><Mail /> Update customer</Button>
            <Button size="sm" onClick={() => toast.success("Escalation sent to Operations Manager")}>Escalate</Button>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-5 sm:grid-cols-3 lg:grid-cols-6">
          {[["Customer", order.customer], ["Product", d.product], ["Quantity", `${order.quantity.toLocaleString()} Units`], ["Order Date", fmtDate(order.orderDate, { month: "long", day: "2-digit", year: "numeric" })], ["Expected Delivery", fmtDate(order.delivery, { month: "long", day: "2-digit", year: "numeric" })], ["Order Value", sar(order.value)]].map(([k, v]) => (
            <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 text-sm font-medium">{v}</dd></div>
          ))}
        </dl>
      </div>

      <Panel className="mt-6" title="Order Progress" subtitle={`${d.steps.filter((s) => s === "Completed").length} of ${STEPS.length} stages completed`}>
        <ol className="grid grid-cols-4 gap-y-6 lg:grid-cols-8">
          {STEPS.map((name, i) => {
            const st = d.steps[i] ?? "Pending";
            const { tone, icon: Icon } = stepStyle[st];
            const next = d.steps[i + 1];
            return (
              <li key={name} className="relative flex flex-col items-center text-center">
                {i < STEPS.length - 1 && (
                  <span className={cn("absolute left-1/2 top-4 h-0.5 w-full", st === "Completed" && next === "Completed" ? "bg-success" : st === "Completed" ? "bg-gradient-to-r from-success to-border" : "bg-border")} />
                )}
                <span className={cn("relative z-10 grid size-8 place-items-center rounded-full ring-4 ring-card",
                  st === "Completed" ? "bg-success text-primary-foreground" : st === "Delayed" ? "bg-destructive text-destructive-foreground" : st === "At Risk" ? "bg-warning text-primary-foreground" : st === "In Progress" ? "bg-primary text-primary-foreground" : "border-2 bg-card text-muted-foreground")}>
                  <Icon className={cn("size-4", st === "Pending" && "size-2.5 fill-current")} />
                </span>
                <span className="mt-2.5 px-1 text-[13px] font-medium leading-tight">{name}</span>
                <span className={cn("mt-1 text-xs font-medium", toneClasses[tone].text)}>{st}</span>
              </li>
            );
          })}
        </ol>
      </Panel>

      {d.risk && <RiskPanel />}

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="h-10 bg-card border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Production Timeline</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <SupplierChain allocs={d.allocs} />
            <Gantt allocs={d.allocs} delivery={order.delivery} revised={d.risk ? "2026-12-03" : undefined} start={order.orderDate} />
          </div>
          <Timeline items={d.timeline} />
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Gantt allocs={d.allocs} delivery={order.delivery} revised={d.risk ? "2026-12-03" : undefined} start={order.orderDate} big />
        </TabsContent>

        <TabsContent value="suppliers" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {d.allocs.map((a, i) => <AllocCard key={a.supplierId} a={a} letter={String.fromCharCode(65 + i)} />)}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Panel title="Documents" subtitle="Files attached to this order" bodyClassName="p-0">
            <ul className="divide-y">
              {[
                [FileImage, `${order.id}_Artwork_Final_v2.pdf`, "Artwork · 14.2 MB", "Nov 20, 2026", "Approved"],
                [FileText, `${order.id}_Dieline_Spec.pdf`, "Technical spec · 2.1 MB", "Nov 19, 2026", "Approved"],
                [FileText, "PO-2026-0412_Royal_Paper.pdf", "Purchase order · 320 KB", "Nov 21, 2026", "Completed"],
                [FileText, "PO-2026-0413_Gulf_Print.pdf", "Purchase order · 318 KB", "Nov 22, 2026", "Delayed"],
                [FileSpreadsheet, "Material_Receipt_GRN-55120.xlsx", "Goods receipt · 48 KB", "Nov 23, 2026", "Completed"],
                [FileText, "Customer_Quotation_Q-3391.pdf", "Quotation · 210 KB", "Nov 17, 2026", "Approved"],
              ].map(([Icon, name, meta, date, st]) => {
                const I = Icon as typeof FileText;
                return (
                  <li key={name as string} className="flex items-center gap-4 px-5 py-3.5">
                    <span className="grid size-9 place-items-center rounded-lg bg-info-soft text-primary"><I className="size-[18px]" /></span>
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{name as string}</div><div className="text-xs text-muted-foreground">{meta as string} · Uploaded {date as string}</div></div>
                    <StatusBadge status={st as string} />
                    <Button variant="ghost" size="icon" onClick={() => toast.success(`Downloading ${name as string}`)}><Download /></Button>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <Panel title="Activity Log" bodyClassName="p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40"><tr>{["Timestamp", "User", "Action", "Details"].map((h) => <th key={h} className="h-10 px-5 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{h}</th>)}</tr></thead>
              <tbody className="divide-y">
                {[
                  ["Nov 26, 09:42", "Abdullah K.", "Escalated delay", "Printing delay flagged High priority"],
                  ["Nov 26, 08:15", "System", "Risk detected", "Revised ETA Dec 03 exceeds commitment Dec 01"],
                  ["Nov 25, 16:30", "Khalid Al-Zahrani", "Supplier update", "Machine maintenance reported on XL-106"],
                  ["Nov 24, 07:05", "Khalid Al-Zahrani", "Stage started", "Printing started, run 1 of 3"],
                  ["Nov 23, 14:20", "Faisal Al-Harbi", "Delivery confirmed", "GRN-55120 posted, 18,500 sheets"],
                  ["Nov 21, 11:00", "Lama S.", "PO issued", "PO-2026-0412 to Royal Paper Industries"],
                  ["Nov 20, 13:48", "Huda Al-Rashid", "Artwork approved", "Customer approval via portal"],
                  ["Nov 18, 10:12", "Lama S.", "Order created", `${order.id} created from quotation Q-3391`],
                ].map((r) => <tr key={r[0]}>{r.map((c, i) => <td key={i} className={cn("px-5 py-3", i === 0 && "tabular-nums text-muted-foreground", i === 2 && "font-medium")}>{c}</td>)}</tr>)}
              </tbody>
            </table>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RiskPanel() {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-destructive/30 bg-card">
      <div className="flex items-center gap-3 border-b border-destructive/20 bg-danger-soft px-5 py-3.5">
        <span className="grid size-8 place-items-center rounded-lg bg-destructive text-destructive-foreground"><AlertTriangle className="size-4" /></span>
        <div><h2 className="text-sm font-semibold">Production Risk Detected</h2><p className="text-xs text-muted-foreground">Delay Impact Analysis · auto-calculated from supplier updates</p></div>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1.4fr_1fr]">
        <div className="p-5">
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[["Delayed Supplier", "Gulf Print Solutions"], ["Delay Duration", "2 Days"], ["Affected Stage", "Lamination & Finishing"]].map(([k, v]) => (
              <div key={k} className="rounded-lg border p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-1 text-sm font-semibold">{v}</dd></div>
            ))}
            <div className="col-span-2 rounded-lg border p-3 sm:col-span-3"><dt className="text-xs text-muted-foreground">Downstream Impact</dt>
              <dd className="mt-2 flex flex-wrap items-center gap-2 text-sm font-medium">
                <StatusBadge status="Printing" tone="danger" /><ChevronRight className="size-4 text-muted-foreground" />
                <StatusBadge status="Lamination & Finishing" tone="warning" /><ChevronRight className="size-4 text-muted-foreground" />
                <StatusBadge status="Quality Inspection" tone="warning" /><ChevronRight className="size-4 text-muted-foreground" />
                <StatusBadge status="Dispatch" tone="warning" />
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center gap-4 rounded-lg bg-muted/60 p-4">
            <CalendarClock className="size-5 text-muted-foreground" />
            <div><div className="text-xs text-muted-foreground">Original Delivery</div><div className="text-sm font-semibold line-through decoration-destructive/60">December 01</div></div>
            <ArrowRight className="size-4 text-muted-foreground" />
            <div><div className="text-xs text-muted-foreground">Revised Estimated Delivery</div><div className="text-sm font-semibold text-destructive">December 03</div></div>
            <span className="ml-auto rounded-md bg-danger-soft px-2 py-1 text-xs font-semibold text-destructive">+2 days</span>
          </div>
        </div>
        <div className="border-t bg-muted/30 p-5 lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2"><Lightbulb className="size-4 text-warning" /><h3 className="text-sm font-semibold">Suggested Actions</h3></div>
          <p className="mt-1 text-xs text-muted-foreground">Recommendations only. Nothing is executed automatically.</p>
          <ul className="mt-3 space-y-2">
            {["Request expedited production from Supplier B.", "Check alternative finishing capacity with Supplier C.", "Review logistics availability.", "Notify the internal operations manager."].map((a, i) => (
              <li key={a} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-info-soft text-xs font-semibold text-primary">{i + 1}</span>
                <span className="flex-1 text-[13px]">{a}</span>
                <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => toast.success("Action logged for follow-up", { description: a })}>Act</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function SupplierChain({ allocs }: { allocs: Alloc[] }) {
  return (
    <Panel title="Supplier Dependency Chain" subtitle="Each stage depends on the completion of the previous supplier">
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        {allocs.map((a, i) => {
          const s = supplierById(a.supplierId);
          const tone = stepStyle[a.status].tone;
          return (
            <div key={a.supplierId} className="flex flex-1 flex-col items-center gap-2 md:flex-row">
              <div className={cn("w-full flex-1 self-stretch rounded-lg border-2 p-3", tone === "danger" ? "border-destructive/50 bg-danger-soft" : tone === "warning" ? "border-warning/60 bg-warning-soft" : tone === "success" ? "border-success/30" : "border-border")}>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Supplier {String.fromCharCode(65 + i)}</div>
                <div className="mt-0.5 text-[13px] font-semibold leading-tight">{s?.name}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{a.responsibility}</div>
                <div className="mt-2"><StatusBadge status={a.status} /></div>
              </div>
              {i < allocs.length - 1 && <ArrowRight className="size-5 shrink-0 rotate-90 text-muted-foreground md:rotate-0" />}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

function Gantt({ allocs, delivery, revised, start, big }: { allocs: Alloc[]; delivery: string; revised?: string | undefined; start: string; big?: boolean }) {
  const t0 = new Date(start + "T00:00:00").getTime();
  const endIso = revised && revised > delivery ? revised : delivery;
  const days = Math.round((new Date(endIso + "T00:00:00").getTime() - t0) / 86400000) + 2;
  const pos = (iso: string) => ((new Date(iso + "T00:00:00").getTime() - t0) / 86400000 / days) * 100;
  const today = pos("2026-11-26");
  return (
    <Panel title="Production Timeline" subtitle="Planned schedule vs. actual / revised progress by supplier"
      actions={<div className="flex gap-3 text-[11px] text-muted-foreground"><span className="flex items-center gap-1"><span className="h-2 w-4 rounded-sm border border-dashed border-muted-foreground/60" />Planned</span><span className="flex items-center gap-1"><span className="h-2 w-4 rounded-sm bg-success" />Actual</span><span className="flex items-center gap-1"><span className="h-2 w-4 rounded-sm bg-destructive" />Delay</span></div>}>
      <div className="relative">
        <div className="ml-[170px] flex border-b pb-1.5 text-[10px] text-muted-foreground">
          {Array.from({ length: days }, (_, i) => {
            const dt = new Date(t0 + i * 86400000);
            return <span key={i} className="flex-1 text-center tabular-nums">{dt.getDate()}</span>;
          })}
        </div>
        <div className={cn("relative", big ? "space-y-5 py-4" : "space-y-3.5 py-3")}>
          <div className="pointer-events-none absolute inset-y-0 left-[170px] right-0">
            <div className="absolute inset-y-0 w-px bg-primary" style={{ left: `${today}%` }}><span className="absolute -top-1 left-1 whitespace-nowrap text-[10px] font-medium text-primary">Today</span></div>
            <div className="absolute inset-y-0 w-px border-l border-dashed border-foreground/40" style={{ left: `${pos(delivery) + 100 / days}%` }} />
          </div>
          {allocs.map((a) => {
            const s = supplierById(a.supplierId);
            const tone = stepStyle[a.status].tone;
            const pe = pos(a.plannedEnd) + 100 / days, st = pos(a.start), en = pos(a.end) + 100 / days;
            return (
              <div key={a.supplierId} className="flex items-center">
                <div className="w-[170px] shrink-0 pr-3"><div className="truncate text-[13px] font-medium">{s?.name}</div><div className="truncate text-[11px] text-muted-foreground">{a.responsibility}</div></div>
                <div className={cn("relative flex-1", big ? "h-8" : "h-6")}>
                  <div className="absolute inset-y-0 rounded border border-dashed border-muted-foreground/50 bg-muted/50" style={{ left: `${st}%`, width: `${Math.max(pe - st, 2)}%` }} />
                  <div className={cn("absolute inset-y-1 rounded", toneClasses[tone === "neutral" ? "info" : tone].dot, tone === "neutral" && "opacity-30")} style={{ left: `${st}%`, width: `${Math.max(Math.min(en, pe) - st, 2)}%` }} />
                  {en > pe && <div className="absolute inset-y-1 rounded-r bg-destructive/80 [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgb(255_255_255/0.25)_4px,rgb(255_255_255/0.25)_8px)]" style={{ left: `${pe}%`, width: `${en - pe}%` }} />}
                </div>
              </div>
            );
          })}
        </div>
        <div className="ml-[170px] mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>{fmtDate(start, { month: "short", day: "2-digit" })}</span>
          <span>Committed delivery {fmtDate(delivery, { month: "short", day: "2-digit" })}{revised && <span className="font-medium text-destructive"> · Revised {fmtDate(revised, { month: "short", day: "2-digit" })}</span>}</span>
        </div>
      </div>
    </Panel>
  );
}

function AllocCard({ a, letter }: { a: Alloc; letter: string }) {
  const s = supplierById(a.supplierId);
  return (
    <div className={cn("rounded-xl border bg-card p-5", a.status === "Delayed" && "border-destructive/40", a.status === "At Risk" && "border-warning/50")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-muted"><Building2 className="size-5 text-muted-foreground" /></span>
          <div><div className="text-xs text-muted-foreground">Supplier {letter}</div><Link to="/suppliers/$supplierId" params={{ supplierId: a.supplierId }} className="text-sm font-semibold hover:text-primary">{s?.name}</Link></div>
        </div>
        <StatusBadge status={a.status} />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm">
        <div><dt className="text-xs text-muted-foreground">Responsibility</dt><dd className="font-medium">{a.responsibility}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Contact</dt><dd className="font-medium">{s?.contact}</dd></div>
        <div><dt className="text-xs text-muted-foreground">{a.responsibility.includes("Delivery") ? "Planned Delivery" : "Planned Completion"}</dt><dd className="font-medium">{fmtDate(a.planned, { month: "long", day: "2-digit" })}</dd></div>
        {a.actual && <div><dt className="text-xs text-muted-foreground">Actual Completion</dt><dd className="font-medium text-success">{fmtDate(a.actual, { month: "long", day: "2-digit" })}</dd></div>}
        {a.revised && a.status === "Delayed" && <div><dt className="text-xs text-muted-foreground">Revised Completion</dt><dd className="font-medium text-destructive">{fmtDate(a.revised, { month: "long", day: "2-digit" })}</dd></div>}
        {a.delay && <div><dt className="text-xs text-muted-foreground">Delay</dt><dd className="font-semibold text-destructive">{a.delay} Days</dd></div>}
      </dl>
    </div>
  );
}

function Timeline({ items }: { items: [string, string, string, Tone][] }) {
  return (
    <Panel title="Order Timeline" subtitle="Key events in chronological order">
      <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-border">
        {items.map(([date, title, desc, tone]) => (
          <li key={date + title} className="relative pl-6">
            <span className={cn("absolute left-0 top-1.5 size-[11px] rounded-full ring-4 ring-card", toneClasses[tone].dot)} />
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{date}</div>
            <div className={cn("text-[13px] font-medium", tone === "danger" && "text-destructive")}>{title}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
