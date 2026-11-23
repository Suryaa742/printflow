import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusTone, type Tone } from "@/data/printflow";

export const toneClasses: Record<Tone, { badge: string; icon: string; dot: string; text: string }> = {
  success: { badge: "bg-success-soft text-success border-success/20", icon: "bg-success-soft text-success", dot: "bg-success", text: "text-success" },
  warning: { badge: "bg-warning-soft text-foreground border-warning/30", icon: "bg-warning-soft text-warning", dot: "bg-warning", text: "text-warning" },
  danger: { badge: "bg-danger-soft text-destructive border-destructive/20", icon: "bg-danger-soft text-destructive", dot: "bg-destructive", text: "text-destructive" },
  info: { badge: "bg-info-soft text-primary border-primary/20", icon: "bg-info-soft text-primary", dot: "bg-primary", text: "text-primary" },
  neutral: { badge: "bg-muted text-muted-foreground border-border", icon: "bg-muted text-muted-foreground", dot: "bg-muted-foreground", text: "text-muted-foreground" },
};

export function StatusBadge({ status, tone, className }: { status: string; tone?: Tone; className?: string }) {
  const t = toneClasses[tone ?? statusTone[status] ?? "neutral"];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium", t.badge, className)}>
      <span className={cn("size-1.5 rounded-full", t.dot)} />
      {status}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, subtitle, actions, children, className, bodyClassName }: {
  title?: ReactNode; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-xl border bg-card shadow-[0_1px_2px_0_rgb(16_24_40/0.04)]", className)}>
      {title && (
        <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function StatCard({ label, value, icon: Icon, tone = "info", change, hint }: {
  label: string; value: string; icon: LucideIcon; tone?: Tone; change?: number; hint?: string;
}) {
  const up = (change ?? 0) >= 0;
  return (
    <div className="rounded-xl border bg-card p-4 shadow-[0_1px_2px_0_rgb(16_24_40/0.04)]">
      <div className="flex items-center justify-between">
        <span className={cn("grid size-9 place-items-center rounded-lg", toneClasses[tone].icon)}>
          <Icon className="size-[18px]" />
        </span>
        {change !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", up ? "text-success" : "text-destructive")}>
            {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-foreground">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      {hint && <div className="mt-2 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function ProgressBar({ value, tone = "info" }: { value: number; tone?: Tone }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full", toneClasses[tone].dot)} style={{ width: `${value}%` }} />
    </div>
  );
}

export const th = "h-10 px-4 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap";
export const td = "px-4 py-3 text-sm whitespace-nowrap";
