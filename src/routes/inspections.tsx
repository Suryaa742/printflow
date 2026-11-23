import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, X, AlertTriangle, Clock, Camera, User, CalendarDays } from "lucide-react";
import { PageHeader, Panel, StatusBadge } from "@/components/pf/ui";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fmtDate, inspections, orderById } from "@/data/printflow";
import { checklistFor, type CheckResult } from "@/data/inspections-detail";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/inspections")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => (typeof s["id"] === "string" ? { id: s["id"] } : {}),
  head: () => ({
    meta: [
      { title: "Inspections — PrintFlow" },
      { name: "description", content: "Detailed quality inspection checklists covering print quality, colour, material, dimensions and packaging." },
      { property: "og:title", content: "Inspections — PrintFlow" },
      { property: "og:description", content: "Inspection checklists with pass/fail results." },
    ],
  }),
  component: InspectionsPage,
});

const resIcon: Record<CheckResult, { icon: typeof Check; cls: string; label: string }> = {
  pass: { icon: Check, cls: "bg-success text-primary-foreground", label: "Pass" },
  fail: { icon: X, cls: "bg-destructive text-destructive-foreground", label: "Fail" },
  warn: { icon: AlertTriangle, cls: "bg-warning text-primary-foreground", label: "Minor issue" },
  pending: { icon: Clock, cls: "bg-muted text-muted-foreground", label: "Pending" },
};

function InspectionsPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate({ from: "/inspections" });
  const sel = inspections.find((i) => i.id === id) ?? inspections[2]!;
  const order = orderById(sel.order);
  const items = checklistFor(sel.result);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const note = notes[sel.id] ?? (sel.result === "Failed" ? "Magenta over-saturation on front panel; ΔE 4.2 against approved proof. Registration drift on sheet edges. Reprint requested from Creative Print House." : sel.result === "Conditional Pass" ? "3 minor cover scuffs in sample of 150. Accepted with customer consent; packing sleeves to be added." : sel.result === "Pending Review" ? "Dimension check and packaging review in progress. Awaiting RFID read test." : "No defects found in sample. Batch released for dispatch.");

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader title="Inspections" subtitle="Run and review inspection checklists for each production batch." />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="space-y-2">
          {inspections.map((i) => (
            <button key={i.id} onClick={() => navigate({ search: { id: i.id } })} className={cn("w-full rounded-xl border bg-card p-3.5 text-left transition hover:border-primary/40", i.id === sel.id && "border-primary ring-2 ring-primary/15")}>
              <div className="flex items-center justify-between"><span className="font-mono text-xs font-semibold">{i.id}</span><StatusBadge status={i.result} /></div>
              <div className="mt-1.5 text-[13px] font-medium">{i.product}</div>
              <div className="text-xs text-muted-foreground">{i.order} · {fmtDate(i.date, { month: "short", day: "2-digit" })}</div>
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className={cn("flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5", sel.result === "Failed" && "border-destructive/40", sel.result === "Passed" && "border-success/40")}>
            <span className={cn("grid size-12 place-items-center rounded-xl", sel.result === "Passed" ? "bg-success-soft text-success" : sel.result === "Failed" ? "bg-danger-soft text-destructive" : "bg-warning-soft text-warning")}>
              {sel.result === "Passed" ? <Check className="size-6" /> : sel.result === "Failed" ? <X className="size-6" /> : <AlertTriangle className="size-6" />}
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2"><h2 className="font-mono text-lg font-semibold">{sel.id}</h2><StatusBadge status={sel.result} /></div>
              <div className="text-sm text-muted-foreground">{sel.product} · <Link to="/orders/$orderId" params={{ orderId: sel.order }} className="text-primary">{sel.order}</Link> · {order?.customer}</div>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1.5"><User className="size-4 text-muted-foreground" />{sel.inspector}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-muted-foreground" />{fmtDate(sel.date)}</span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="Product Specifications">
              <dl className="space-y-2.5 text-sm">
                {[["Product", sel.product], ["Order quantity", `${order?.quantity.toLocaleString()} units`], ["Sample size", `${sel.qty.toLocaleString()} units (AQL 1.0)`], ["Substrate", "SBS 350gsm / PVC 0.76mm"], ["Print", "CMYK + Pantone 7621C"], ["Finish", "Matte lamination + spot UV"], ["Size", "220 × 160 × 80 mm"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>
                ))}
              </dl>
            </Panel>
            <Panel className="lg:col-span-2" title="Inspection Checklist" subtitle={`${items.filter((i) => i.result === "pass").length} of ${items.length} checks passed`} bodyClassName="p-0">
              <ul className="divide-y">
                {items.map((it) => {
                  const r = resIcon[it.result];
                  return (
                    <li key={it.area} className="flex items-center gap-4 px-5 py-3.5">
                      <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", r.cls)}><r.icon className="size-4" /></span>
                      <div className="min-w-0 flex-1"><div className="text-sm font-medium">{it.area}</div><div className="text-xs text-muted-foreground">{it.criteria}</div></div>
                      <div className="hidden w-32 text-xs sm:block"><div className="text-muted-foreground">Spec</div><div className="font-medium">{it.spec}</div></div>
                      <div className="w-28 text-xs"><div className="text-muted-foreground">Measured</div><div className={cn("font-medium", it.result === "fail" && "text-destructive")}>{it.measured}</div></div>
                      <span className={cn("w-20 text-right text-xs font-semibold", it.result === "pass" ? "text-success" : it.result === "fail" ? "text-destructive" : it.result === "warn" ? "text-warning" : "text-muted-foreground")}>{r.label}</span>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>

          <Panel title="Defect Notes" actions={<Button variant="outline" size="sm" onClick={() => toast.success("Photo evidence attached")}><Camera /> Attach photos</Button>}>
            <Textarea rows={3} value={note} onChange={(e) => setNotes((n) => ({ ...n, [sel.id]: e.target.value }))} />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">Final decision is recorded against {sel.order} and notifies the operations team.</span>
              <div className="flex gap-2">
                <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-danger-soft" onClick={() => toast.error(`${sel.id} marked as Failed`, { description: "Rework request sent to supplier." })}><X /> Mark as Fail</Button>
                <Button className="bg-success text-primary-foreground hover:bg-success/90" onClick={() => toast.success(`${sel.id} marked as Passed`, { description: "Batch released for dispatch." })}><Check /> Mark as Pass</Button>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
