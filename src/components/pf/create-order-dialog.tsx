import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { suppliers, type Order } from "@/data/printflow";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function CreateOrderDialog({ open, onOpenChange, onCreate, nextId }: {
  open: boolean; onOpenChange: (o: boolean) => void; onCreate: (o: Order) => void; nextId: string;
}) {
  const [customer, setCustomer] = useState("Tamimi Markets");
  const [contact, setContact] = useState("Sultan Al-Tamimi");
  const [product, setProduct] = useState("Ramadan Promotional Boxes");
  const [qty, setQty] = useState("12000");
  const [deadline, setDeadline] = useState("2026-12-15");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [picked, setPicked] = useState<string[]>(["SUP-1005", "SUP-1002", "SUP-1004"]);

  const submit = () => {
    if (!customer || !product || !Number(qty)) { toast.error("Please complete customer, product and quantity."); return; }
    onCreate({ id: nextId, customer, product, quantity: Number(qty), orderDate: "2026-11-23", delivery: deadline, suppliers: picked, stage: "Awaiting Approval", priority, status: "Pending", value: Number(qty) * 9 });
    toast.success(`Order ${nextId} created`, { description: `${customer} · ${Number(qty).toLocaleString()} units` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>Order {nextId} · will be routed for artwork approval once submitted.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer information</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Customer name</Label><Input value={customer} onChange={(e) => setCustomer(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Contact person</Label><Input value={contact} onChange={(e) => setContact(e.target.value)} /></div>
            </div>
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Product specifications</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2"><Label>Product / project</Label><Input value={product} onChange={(e) => setProduct(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Material</Label>
                <Select defaultValue="sbs"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="sbs">SBS Board 350gsm</SelectItem><SelectItem value="kraft">Kraft 300gsm</SelectItem><SelectItem value="rigid">Rigid greyboard 2mm</SelectItem><SelectItem value="art">Art paper 170gsm</SelectItem>
                </SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Finishing</Label>
                <Select defaultValue="matte"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="matte">Matte lamination + spot UV</SelectItem><SelectItem value="gloss">Gloss lamination</SelectItem><SelectItem value="foil">Gold foil stamping</SelectItem><SelectItem value="none">No finishing</SelectItem>
                </SelectContent></Select></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Notes</Label><Textarea rows={2} defaultValue="4C + Pantone 7621C, bilingual Arabic/English copy. Dieline v2 attached." /></div>
            </div>
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Quantity & schedule</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5"><Label>Quantity (units)</Label><Input type="number" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Delivery deadline</Label><Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                  <SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem>
                </SelectContent></Select></div>
            </div>
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Supplier assignment</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {suppliers.slice(0, 6).map((s) => {
                const on = picked.includes(s.id);
                return (
                  <button type="button" key={s.id} onClick={() => setPicked((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))}
                    className={cn("flex items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors", on ? "border-primary bg-info-soft" : "hover:bg-muted")}>
                    <span><span className="block text-sm font-medium">{s.name}</span><span className="text-xs text-muted-foreground">{s.category}</span></span>
                    <span className={cn("size-4 rounded border", on ? "border-primary bg-primary" : "")} />
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>Create Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
