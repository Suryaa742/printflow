import { createFileRoute } from "@tanstack/react-router";
import { Check, Minus, Plus, GripVertical } from "lucide-react";
import { PageHeader, Panel, StatusBadge, th, td } from "@/components/pf/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PrintFlow" },
      { name: "description", content: "Configure company profile, users, roles, notifications and production workflow." },
      { property: "og:title", content: "Settings — PrintFlow" },
      { property: "og:description", content: "PrintFlow workspace settings." },
    ],
  }),
  component: SettingsPage,
});

const save = () => toast.success("Settings saved");
const Field = ({ label, value }: { label: string; value: string }) => <div className="space-y-1.5"><Label>{label}</Label><Input defaultValue={value} /></div>;

const users = [
  ["Abdullah Al-Khaldi", "abdullah.k@printflow.sa", "Operations Manager", "Active", "Just now"],
  ["Lama Al-Saud", "lama.s@printflow.sa", "Procurement Officer", "Active", "15 min ago"],
  ["Majed Al-Rasheed", "majed.r@printflow.sa", "Finance Director", "Active", "2 hrs ago"],
  ["Mohammed Al-Shammari", "m.shammari@printflow.sa", "Quality Inspector", "Active", "40 min ago"],
  ["Reem Al-Fahad", "reem.f@printflow.sa", "Quality Inspector", "Active", "Yesterday"],
  ["Sara Al-Otaibi", "sara.o@printflow.sa", "Production Planner", "Active", "1 hr ago"],
  ["Yousef Al-Malki", "yousef.m@printflow.sa", "Quality Inspector", "Inactive", "12 days ago"],
];
const perms = ["View orders", "Create / edit orders", "Approve purchase orders", "Manage suppliers", "Record inspections", "View financials", "Manage users"];
const roles: [string, boolean[]][] = [
  ["Administrator", [true, true, true, true, true, true, true]],
  ["Operations Manager", [true, true, true, true, true, true, false]],
  ["Procurement Officer", [true, true, false, true, false, true, false]],
  ["Production Planner", [true, true, false, false, false, false, false]],
  ["Quality Inspector", [true, false, false, false, true, false, false]],
];

function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader title="Settings" subtitle="Manage your workspace, team and production configuration." />
      <Tabs defaultValue="general">
        <TabsList className="h-10 flex-wrap border bg-card">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="company">Company Profile</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="notifications">Notification Preferences</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <Panel title="General Settings" subtitle="Regional and display preferences">
            <div className="grid gap-4 sm:grid-cols-2">
              {[["Language", "en", [["en", "English"], ["ar", "العربية (Arabic)"]]], ["Currency", "sar", [["sar", "SAR – Saudi Riyal"], ["usd", "USD – US Dollar"]]], ["Time zone", "ast", [["ast", "(GMT+03:00) Riyadh"], ["gst", "(GMT+04:00) Dubai"]]], ["Date format", "mdy", [["mdy", "Nov 23, 2026"], ["dmy", "23/11/2026"]]], ["Work week", "sun", [["sun", "Sunday – Thursday"], ["mon", "Monday – Friday"]]], ["Default VAT rate", "15", [["15", "15% (KSA standard)"], ["0", "0% (exempt)"]]]].map(([l, v, opts]) => (
                <div key={l as string} className="space-y-1.5"><Label>{l as string}</Label>
                  <Select defaultValue={v as string}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{(opts as string[][]).map(([k, t]) => <SelectItem key={k} value={k!}>{t}</SelectItem>)}</SelectContent></Select>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end"><Button onClick={save}>Save changes</Button></div>
          </Panel>
        </TabsContent>

        <TabsContent value="company" className="mt-4">
          <Panel title="Company Profile" subtitle="Appears on purchase orders and customer documents">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Legal name" value="PrintFlow Manufacturing Co." /><Field label="Trade name (Arabic)" value="شركة برنت فلو للتصنيع" />
              <Field label="Commercial Registration (CR)" value="1010773459" /><Field label="VAT number" value="300158842100003" />
              <Field label="Address" value="Street 64, 2nd Industrial City, Riyadh 14332" /><Field label="Phone" value="+966 11 265 4400" />
              <Field label="Email" value="operations@printflow.sa" /><Field label="Website" value="www.printflow.sa" />
            </div>
            <div className="mt-6 flex justify-end"><Button onClick={save}>Save profile</Button></div>
          </Panel>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Panel title="User Management" subtitle={`${users.length} team members`} bodyClassName="p-0" actions={<Button size="sm" onClick={() => toast.success("Invitation sent")}><Plus /> Invite user</Button>}>
            <table className="w-full"><thead className="border-b bg-muted/40"><tr>{["Name", "Email", "Role", "Status", "Last active"].map((h) => <th key={h} className={th}>{h}</th>)}</tr></thead>
              <tbody className="divide-y">{users.map(([n, e, r, s, l]) => (
                <tr key={e}><td className={td}><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-full bg-info-soft text-xs font-semibold text-primary">{n!.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span><span className="font-medium">{n}</span></div></td>
                  <td className={`${td} text-muted-foreground`}>{e}</td><td className={td}>{r}</td><td className={td}><StatusBadge status={s!} /></td><td className={`${td} text-muted-foreground`}>{l}</td></tr>
              ))}</tbody></table>
          </Panel>
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <Panel title="Roles & Permissions" bodyClassName="p-0">
            <div className="overflow-x-auto"><table className="w-full"><thead className="border-b bg-muted/40"><tr><th className={th}>Role</th>{perms.map((p) => <th key={p} className={`${th} text-center`}>{p}</th>)}</tr></thead>
              <tbody className="divide-y">{roles.map(([r, ps]) => (
                <tr key={r}><td className={`${td} font-medium`}>{r}</td>{ps.map((v, i) => <td key={i} className="px-4 py-3 text-center">{v ? <Check className="mx-auto size-4 text-success" /> : <Minus className="mx-auto size-4 text-muted-foreground/50" />}</td>)}</tr>
              ))}</tbody></table></div>
          </Panel>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Panel title="Notification Preferences" subtitle="Choose how you receive each alert type">
            <div className="divide-y">
              <div className="grid grid-cols-[1fr_80px_80px_80px] pb-2 text-xs font-semibold uppercase text-muted-foreground"><span>Alert</span><span className="text-center">In-app</span><span className="text-center">Email</span><span className="text-center">SMS</span></div>
              {[["Supplier delay reported", [true, true, true]], ["Production delay detected", [true, true, false]], ["Order pending approval", [true, true, false]], ["Quality inspection failed", [true, true, true]], ["Upcoming delivery (24h)", [true, false, false]], ["Daily operations summary", [false, true, false]]].map(([l, v]) => (
                <div key={l as string} className="grid grid-cols-[1fr_80px_80px_80px] items-center py-3 text-sm"><span>{l as string}</span>{(v as boolean[]).map((d, i) => <span key={i} className="flex justify-center"><Switch defaultChecked={d} /></span>)}</div>
              ))}
            </div>
            <div className="mt-4 flex justify-end"><Button onClick={save}>Save preferences</Button></div>
          </Panel>
        </TabsContent>

        <TabsContent value="workflow" className="mt-4 grid gap-6 lg:grid-cols-2">
          <Panel title="Production Stages" subtitle="Order of stages and standard durations">
            <ul className="space-y-2">{[["Order Received", "0.5 d"], ["Artwork Approval", "1.5 d"], ["Material Procurement", "2.5 d"], ["Printing", "3 d"], ["Lamination & Finishing", "2 d"], ["Quality Inspection", "1 d"], ["Packing & Dispatch", "1 d"], ["Final Delivery", "1 d"]].map(([s, d], i) => (
              <li key={s} className="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm"><GripVertical className="size-4 text-muted-foreground" /><span className="w-5 text-xs text-muted-foreground">{i + 1}</span><span className="flex-1 font-medium">{s}</span><span className="rounded bg-muted px-2 py-0.5 text-xs">{d}</span></li>
            ))}</ul>
          </Panel>
          <Panel title="Risk & Escalation Rules">
            <div className="space-y-4 text-sm">
              {[["Flag order At Risk when downstream buffer falls below", "1 day"], ["Escalate supplier delay to Operations Manager after", "24 hours"], ["Mark supplier At Risk when on-time rate drops below", "85%"], ["Require Finance approval for POs above", "SAR 100,000"]].map(([l, v]) => (
                <div key={l} className="flex items-center justify-between gap-4"><span>{l}</span><Input defaultValue={v} className="w-32" /></div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t pt-4"><span>Auto-suggest recovery actions on delay detection</span><Switch defaultChecked /></div>
              <div className="flex items-center justify-between gap-4"><span>Require customer re-approval for artwork changes</span><Switch defaultChecked /></div>
            </div>
            <div className="mt-6 flex justify-end"><Button onClick={save}>Save workflow</Button></div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
