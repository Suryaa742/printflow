export type Tone = "success" | "warning" | "danger" | "info" | "neutral";

export const statusTone: Record<string, Tone> = {
  "At Risk": "warning", Delayed: "danger", "In Progress": "info", Pending: "neutral", Completed: "success",
  Delivered: "success", "In Transit": "info", Dispatched: "info", Packing: "neutral", "Ready for Dispatch": "info",
  Passed: "success", Failed: "danger", "Pending Review": "warning", Active: "success", Inactive: "neutral",
  High: "danger", Medium: "warning", Low: "neutral", Draft: "neutral", Sent: "info", Acknowledged: "info",
  "Partially Received": "warning", "On Track": "success", Critical: "danger", Info: "info", Approved: "success",
  "Awaiting Approval": "warning", "Conditional Pass": "warning",
};

export interface Order {
  id: string; customer: string; product: string; quantity: number; orderDate: string; delivery: string;
  suppliers: string[]; stage: string; priority: "High" | "Medium" | "Low"; status: string; value: number;
}

export const orders: Order[] = [
  { id: "PF-2026-0148", customer: "Al Noor Retail Group", product: "Branded Packaging Kits", quantity: 50000, orderDate: "2026-11-18", delivery: "2026-12-01", suppliers: ["SUP-1001", "SUP-1002", "SUP-1003", "SUP-1004"], stage: "Printing", priority: "High", status: "At Risk", value: 412500 },
  { id: "PF-2026-0149", customer: "Emirates Hospitality Group", product: "Hotel Access Cards", quantity: 20000, orderDate: "2026-11-19", delivery: "2026-12-05", suppliers: ["SUP-1006", "SUP-1003", "SUP-1004"], stage: "Quality Inspection", priority: "Medium", status: "In Progress", value: 96000 },
  { id: "PF-2026-0150", customer: "Gulf Corporate Solutions", product: "Corporate Brochures", quantity: 10000, orderDate: "2026-11-20", delivery: "2026-12-03", suppliers: ["SUP-1002", "SUP-1003"], stage: "Finishing", priority: "Medium", status: "In Progress", value: 58500 },
  { id: "PF-2026-0151", customer: "Saudi Retail Partners", product: "Thermal Label Rolls", quantity: 75000, orderDate: "2026-11-20", delivery: "2026-12-08", suppliers: ["SUP-1001", "SUP-1006", "SUP-1004"], stage: "Material Procurement", priority: "High", status: "Pending", value: 187500 },
  { id: "PF-2026-0152", customer: "Prime Marketing Group", product: "Promotional Gift Boxes", quantity: 15000, orderDate: "2026-11-21", delivery: "2026-12-06", suppliers: ["SUP-1005", "SUP-1002", "SUP-1003", "SUP-1004"], stage: "Material Procurement", priority: "High", status: "At Risk", value: 264000 },
  { id: "PF-2026-0153", customer: "Riyadh Season Events", product: "Event Wristbands & Passes", quantity: 120000, orderDate: "2026-11-21", delivery: "2026-12-02", suppliers: ["SUP-1006", "SUP-1004"], stage: "Ready for Dispatch", priority: "High", status: "In Progress", value: 144000 },
  { id: "PF-2026-0154", customer: "Almarai Distribution", product: "Corrugated Shipping Cartons", quantity: 40000, orderDate: "2026-11-22", delivery: "2026-12-10", suppliers: ["SUP-1005", "SUP-1001"], stage: "Awaiting Approval", priority: "Medium", status: "Pending", value: 228000 },
  { id: "PF-2026-0155", customer: "Jarir Bookstore", product: "Back-to-School Catalogues", quantity: 25000, orderDate: "2026-11-22", delivery: "2026-12-04", suppliers: ["SUP-1002", "SUP-1003", "SUP-1004"], stage: "Printing", priority: "Medium", status: "In Progress", value: 112500 },
  { id: "PF-2026-0156", customer: "Nahdi Medical Company", product: "Pharmacy Carry Bags", quantity: 60000, orderDate: "2026-11-15", delivery: "2026-11-28", suppliers: ["SUP-1005", "SUP-1004"], stage: "Ready for Dispatch", priority: "High", status: "At Risk", value: 132000 },
  { id: "PF-2026-0157", customer: "Saudia Catering", product: "In-Flight Meal Sleeves", quantity: 80000, orderDate: "2026-11-23", delivery: "2026-12-12", suppliers: ["SUP-1001", "SUP-1002"], stage: "Awaiting Approval", priority: "Low", status: "Pending", value: 176000 },
  { id: "PF-2026-0158", customer: "Panda Retail Company", product: "Shelf Talkers & Wobblers", quantity: 30000, orderDate: "2026-11-16", delivery: "2026-11-30", suppliers: ["SUP-1006", "SUP-1003"], stage: "Finishing", priority: "Medium", status: "Delayed", value: 54000 },
  { id: "PF-2026-0159", customer: "STC Retail", product: "SIM Card Packaging", quantity: 100000, orderDate: "2026-11-17", delivery: "2026-12-01", suppliers: ["SUP-1006", "SUP-1005", "SUP-1004"], stage: "Quality Inspection", priority: "High", status: "In Progress", value: 210000 },
  { id: "PF-2026-0160", customer: "Bateel Gourmet", product: "Luxury Date Gift Boxes", quantity: 8000, orderDate: "2026-11-18", delivery: "2026-12-07", suppliers: ["SUP-1005", "SUP-1003"], stage: "Printing", priority: "Medium", status: "In Progress", value: 152000 },
  { id: "PF-2026-0161", customer: "Al Othaim Markets", product: "Promotional Flyers", quantity: 200000, orderDate: "2026-11-12", delivery: "2026-11-25", suppliers: ["SUP-1002", "SUP-1004"], stage: "Delivered", priority: "Low", status: "Completed", value: 64000 },
  { id: "PF-2026-0162", customer: "Kudu Restaurants", product: "Burger Wrap Paper", quantity: 150000, orderDate: "2026-11-14", delivery: "2026-11-29", suppliers: ["SUP-1001", "SUP-1006"], stage: "Material Procurement", priority: "Medium", status: "Delayed", value: 90000 },
  { id: "PF-2026-0163", customer: "Elm Company", product: "Annual Report Print", quantity: 3000, orderDate: "2026-11-13", delivery: "2026-11-26", suppliers: ["SUP-1002", "SUP-1003", "SUP-1004"], stage: "Delivered", priority: "Medium", status: "Completed", value: 87000 },
];

export interface Supplier {
  id: string; name: string; short: string; category: string; contact: string; phone: string; email: string; location: string;
  activeOrders: number; onTime: number; rating: number; status: string; since: string; cr: string; avgTurnaround: number; qualityScore: number;
}

export const suppliers: Supplier[] = [
  { id: "SUP-1001", name: "Royal Paper Industries", short: "Supplier A", category: "Raw Materials", contact: "Faisal Al-Harbi", phone: "+966 11 465 2201", email: "f.alharbi@royalpaper.sa", location: "Riyadh", activeOrders: 9, onTime: 96, rating: 4.8, status: "Active", since: "2019", cr: "1010458821", avgTurnaround: 3.2, qualityScore: 97 },
  { id: "SUP-1002", name: "Gulf Print Solutions", short: "Supplier B", category: "Commercial Printing", contact: "Khalid Al-Zahrani", phone: "+966 12 667 3410", email: "k.zahrani@gulfprint.sa", location: "Jeddah", activeOrders: 12, onTime: 82, rating: 4.1, status: "At Risk", since: "2020", cr: "4030219874", avgTurnaround: 5.8, qualityScore: 89 },
  { id: "SUP-1003", name: "Premium Finishing Works", short: "Supplier C", category: "Lamination & Finishing", contact: "Omar Al-Dossary", phone: "+966 13 834 1190", email: "omar@premiumfinishing.sa", location: "Dammam", activeOrders: 8, onTime: 91, rating: 4.5, status: "Active", since: "2021", cr: "2050117653", avgTurnaround: 3.9, qualityScore: 93 },
  { id: "SUP-1004", name: "Fast Logistics", short: "Supplier D", category: "Transportation & Delivery", contact: "Saad Al-Qahtani", phone: "+966 11 290 7745", email: "ops@fastlogistics.sa", location: "Riyadh", activeOrders: 14, onTime: 88, rating: 4.3, status: "Active", since: "2018", cr: "1010336902", avgTurnaround: 1.6, qualityScore: 90 },
  { id: "SUP-1005", name: "Al Fajr Packaging", short: "Supplier E", category: "Packaging Materials", contact: "Nasser Al-Mutairi", phone: "+966 11 478 5530", email: "nasser@alfajrpack.sa", location: "Riyadh", activeOrders: 7, onTime: 97, rating: 4.9, status: "Active", since: "2017", cr: "1010227714", avgTurnaround: 2.8, qualityScore: 98 },
  { id: "SUP-1006", name: "Creative Print House", short: "Supplier F", category: "Digital Printing", contact: "Rana Al-Ghamdi", phone: "+966 12 614 8820", email: "rana@creativeprint.sa", location: "Jeddah", activeOrders: 10, onTime: 93, rating: 4.6, status: "Active", since: "2022", cr: "4030388150", avgTurnaround: 2.4, qualityScore: 94 },
  { id: "SUP-1007", name: "Eastern Ink & Coatings", short: "Supplier G", category: "Inks & Consumables", contact: "Hamad Al-Shehri", phone: "+966 13 882 0047", email: "hamad@easternink.sa", location: "Al Khobar", activeOrders: 4, onTime: 84, rating: 3.9, status: "At Risk", since: "2023", cr: "2051044219", avgTurnaround: 4.6, qualityScore: 86 },
  { id: "SUP-1008", name: "Najd Corrugated Boxes", short: "Supplier H", category: "Packaging Materials", contact: "Turki Al-Otaibi", phone: "+966 11 512 9934", email: "turki@najdboxes.sa", location: "Riyadh", activeOrders: 5, onTime: 92, rating: 4.4, status: "Active", since: "2020", cr: "1010551208", avgTurnaround: 3.1, qualityScore: 92 },
];

export const supplierById = (id: string) => suppliers.find((s) => s.id === id);

export const dashboardKpis = [
  { label: "Total Active Orders", value: "48", change: 8.4, tone: "info" as Tone, icon: "Package" },
  { label: "Pending Approvals", value: "07", change: -12.5, tone: "warning" as Tone, icon: "Clock" },
  { label: "In Production", value: "24", change: 4.3, tone: "info" as Tone, icon: "Factory" },
  { label: "At Risk", value: "05", change: 25.0, tone: "warning" as Tone, icon: "AlertTriangle" },
  { label: "Delayed Orders", value: "03", change: -25.0, tone: "danger" as Tone, icon: "TimerOff" },
  { label: "Completed This Month", value: "126", change: 11.2, tone: "success" as Tone, icon: "CheckCircle2" },
];

export const statusDistribution = [
  { name: "In Production", value: 24, color: "var(--primary)" },
  { name: "Awaiting Approval", value: 7, color: "var(--warning)" },
  { name: "Quality Inspection", value: 6, color: "var(--chart-violet)" },
  { name: "Ready for Dispatch", value: 5, color: "var(--chart-teal)" },
  { name: "Delivered", value: 18, color: "var(--success)" },
  { name: "Delayed", value: 3, color: "var(--destructive)" },
];

export const weeklyProduction = [
  { week: "W44 · Oct 26", planned: 28, completed: 27 },
  { week: "W45 · Nov 2", planned: 31, completed: 29 },
  { week: "W46 · Nov 9", planned: 34, completed: 33 },
  { week: "W47 · Nov 16", planned: 36, completed: 31 },
  { week: "W48 · Nov 23", planned: 38, completed: 34 },
  { week: "W49 · Nov 30", planned: 35, completed: 12 },
];

export const supplierPerformance = [
  { name: "Supplier A", full: "Royal Paper Industries", value: 96 },
  { name: "Supplier B", full: "Gulf Print Solutions", value: 82 },
  { name: "Supplier C", full: "Premium Finishing Works", value: 91 },
  { name: "Supplier D", full: "Fast Logistics", value: 88 },
  { name: "Supplier E", full: "Al Fajr Packaging", value: 97 },
];

export const criticalAlerts = [
  { order: "PF-2026-0148", supplier: "Gulf Print Solutions", issue: "Printing production delayed by 2 days.", impact: "Finishing schedule at risk.", priority: "High" },
  { order: "PF-2026-0152", supplier: "Premium Packaging Co.", issue: "Raw material delivery pending.", impact: "Production may start late.", priority: "Medium" },
  { order: "PF-2026-0156", supplier: "Fast Logistics", issue: "Dispatch confirmation pending.", impact: "Delivery deadline approaching.", priority: "High" },
];

export const purchaseOrders = [
  { id: "PO-2026-0412", supplier: "SUP-1001", order: "PF-2026-0148", item: "SBS Board 350gsm, 70×100cm", qty: "18,500 sheets", value: 92500, date: "2026-11-21", expected: "2026-11-23", status: "Completed" },
  { id: "PO-2026-0413", supplier: "SUP-1002", order: "PF-2026-0148", item: "Offset printing 4C + spot, 50,000 kits", qty: "50,000 units", value: 145000, date: "2026-11-22", expected: "2026-11-24", status: "Delayed" },
  { id: "PO-2026-0414", supplier: "SUP-1003", order: "PF-2026-0148", item: "Matte lamination + spot UV", qty: "50,000 units", value: 68000, date: "2026-11-22", expected: "2026-11-28", status: "Acknowledged" },
  { id: "PO-2026-0415", supplier: "SUP-1004", order: "PF-2026-0148", item: "Palletised delivery, Riyadh DC", qty: "24 pallets", value: 18500, date: "2026-11-22", expected: "2026-12-01", status: "Sent" },
  { id: "PO-2026-0416", supplier: "SUP-1005", order: "PF-2026-0152", item: "Rigid gift box blanks, 2mm greyboard", qty: "15,000 units", value: 97500, date: "2026-11-21", expected: "2026-11-26", status: "Partially Received" },
  { id: "PO-2026-0417", supplier: "SUP-1006", order: "PF-2026-0149", item: "PVC card printing with RFID inlay", qty: "20,000 cards", value: 54000, date: "2026-11-19", expected: "2026-11-25", status: "Completed" },
  { id: "PO-2026-0418", supplier: "SUP-1001", order: "PF-2026-0151", item: "Thermal paper rolls 80gsm", qty: "1,200 rolls", value: 63600, date: "2026-11-23", expected: "2026-11-30", status: "Sent" },
  { id: "PO-2026-0419", supplier: "SUP-1007", order: "PF-2026-0155", item: "Process inks CMYK, 200kg", qty: "200 kg", value: 21400, date: "2026-11-23", expected: "2026-11-27", status: "Draft" },
  { id: "PO-2026-0420", supplier: "SUP-1008", order: "PF-2026-0154", item: "Corrugated B-flute sheets", qty: "42,000 sheets", value: 88200, date: "2026-11-23", expected: "2026-12-02", status: "Draft" },
  { id: "PO-2026-0421", supplier: "SUP-1002", order: "PF-2026-0155", item: "Catalogue printing, 48pp saddle-stitched", qty: "25,000 copies", value: 71250, date: "2026-11-22", expected: "2026-11-29", status: "Acknowledged" },
  { id: "PO-2026-0422", supplier: "SUP-1001", order: "PF-2026-0162", item: "Greaseproof paper 40gsm", qty: "9 tonnes", value: 40500, date: "2026-11-15", expected: "2026-11-20", status: "Delayed" },
];

export const shipments = [
  { id: "SHP-2026-0881", order: "PF-2026-0153", customer: "Riyadh Season Events", partner: "Fast Logistics", dispatch: "2026-11-30", arrival: "2026-12-01", status: "Ready for Dispatch", ref: "FLX-RUH-7720431", from: "Riyadh Plant", to: "Boulevard City, Riyadh", step: 1 },
  { id: "SHP-2026-0882", order: "PF-2026-0156", customer: "Nahdi Medical Company", partner: "Fast Logistics", dispatch: "2026-11-27", arrival: "2026-11-28", status: "Packing", ref: "FLX-JED-7720458", from: "Riyadh Plant", to: "Nahdi DC, Jeddah", step: 0 },
  { id: "SHP-2026-0879", order: "PF-2026-0161", customer: "Al Othaim Markets", partner: "Fast Logistics", dispatch: "2026-11-24", arrival: "2026-11-25", status: "Delivered", ref: "FLX-RUH-7719902", from: "Riyadh Plant", to: "Othaim DC, Riyadh", step: 4 },
  { id: "SHP-2026-0880", order: "PF-2026-0163", customer: "Elm Company", partner: "SMSA Express", dispatch: "2026-11-25", arrival: "2026-11-26", status: "Delivered", ref: "SMSA-290017734", from: "Riyadh Plant", to: "Elm HQ, Riyadh", step: 4 },
  { id: "SHP-2026-0883", order: "PF-2026-0149", customer: "Emirates Hospitality Group", partner: "Aramex Freight", dispatch: "2026-12-03", arrival: "2026-12-05", status: "Pending", ref: "ARX-DXB-55120988", from: "Jeddah Hub", to: "Dubai, UAE", step: 0 },
  { id: "SHP-2026-0877", order: "PF-2026-0158", customer: "Panda Retail Company", partner: "Naqel Express", dispatch: "2026-11-26", arrival: "2026-11-27", status: "Delayed", ref: "NQL-DMM-4412076", from: "Dammam Finishing", to: "Panda DC, Riyadh", step: 3 },
  { id: "SHP-2026-0884", order: "PF-2026-0159", customer: "STC Retail", partner: "Fast Logistics", dispatch: "2026-11-28", arrival: "2026-11-29", status: "In Transit", ref: "FLX-RUH-7720512", from: "Jeddah Hub", to: "STC Warehouse, Riyadh", step: 3 },
  { id: "SHP-2026-0878", order: "PF-2026-0150", customer: "Gulf Corporate Solutions", partner: "SMSA Express", dispatch: "2026-11-27", arrival: "2026-11-28", status: "Dispatched", ref: "SMSA-290018120", from: "Dammam Finishing", to: "Al Khobar Office", step: 2 },
  { id: "SHP-2026-0885", order: "PF-2026-0148", customer: "Al Noor Retail Group", partner: "Fast Logistics", dispatch: "2026-12-02", arrival: "2026-12-03", status: "Pending", ref: "FLX-RUH-7720600", from: "Dammam Finishing", to: "Al Noor DC, Riyadh", step: 0 },
];

export const inspections = [
  { id: "QC-2026-0311", order: "PF-2026-0149", product: "Hotel Access Cards", qty: 500, inspector: "Mohammed Al-Shammari", date: "2026-11-26", result: "Pending Review" },
  { id: "QC-2026-0310", order: "PF-2026-0159", product: "SIM Card Packaging", qty: 1200, inspector: "Reem Al-Fahad", date: "2026-11-25", result: "Passed" },
  { id: "QC-2026-0309", order: "PF-2026-0158", product: "Shelf Talkers & Wobblers", qty: 800, inspector: "Mohammed Al-Shammari", date: "2026-11-25", result: "Failed" },
  { id: "QC-2026-0308", order: "PF-2026-0153", product: "Event Wristbands & Passes", qty: 3000, inspector: "Yousef Al-Malki", date: "2026-11-24", result: "Passed" },
  { id: "QC-2026-0307", order: "PF-2026-0161", product: "Promotional Flyers", qty: 2000, inspector: "Reem Al-Fahad", date: "2026-11-23", result: "Passed" },
  { id: "QC-2026-0306", order: "PF-2026-0163", product: "Annual Report Print", qty: 150, inspector: "Yousef Al-Malki", date: "2026-11-23", result: "Conditional Pass" },
  { id: "QC-2026-0305", order: "PF-2026-0156", product: "Pharmacy Carry Bags", qty: 1500, inspector: "Mohammed Al-Shammari", date: "2026-11-22", result: "Passed" },
];

export const notifications = [
  { id: 1, category: "Supplier Delay", severity: "Critical", order: "PF-2026-0148", title: "Gulf Print Solutions reported a 2-day delay", body: "Heidelberg XL-106 under maintenance. Revised printing completion Nov 26.", time: "12 min ago", unread: true },
  { id: 2, category: "Upcoming Delivery", severity: "High", order: "PF-2026-0156", title: "Dispatch confirmation pending", body: "Fast Logistics has not confirmed the truck for Nahdi Medical, due Nov 28.", time: "38 min ago", unread: true },
  { id: 3, category: "Quality Issue", severity: "High", order: "PF-2026-0158", title: "Inspection QC-2026-0309 failed", body: "Colour deviation ΔE 4.2 on Panda shelf talkers. Reprint requested.", time: "1 hr ago", unread: true },
  { id: 4, category: "Production Delay", severity: "Medium", order: "PF-2026-0162", title: "Greaseproof paper not received", body: "PO-2026-0422 is 3 days overdue from Royal Paper Industries.", time: "2 hrs ago", unread: true },
  { id: 5, category: "Pending Approval", severity: "Medium", order: "PF-2026-0154", title: "Artwork awaiting customer approval", body: "Almarai carton dieline v3 sent Nov 22. Reminder scheduled.", time: "3 hrs ago", unread: false },
  { id: 6, category: "Supplier Delay", severity: "Medium", order: "PF-2026-0152", title: "Raw material delivery pending", body: "Rigid box blanks partially received (9,000 of 15,000).", time: "5 hrs ago", unread: false },
  { id: 7, category: "Pending Approval", severity: "Info", order: "PF-2026-0157", title: "New order requires sign-off", body: "Saudia Catering meal sleeves, SAR 176,000. Awaiting manager approval.", time: "Yesterday", unread: false },
  { id: 8, category: "Upcoming Delivery", severity: "Info", order: "PF-2026-0153", title: "Shipment scheduled for Nov 30", body: "SHP-2026-0881 to Boulevard City, 18 pallets.", time: "Yesterday", unread: false },
];

export const stages = ["Awaiting Approval", "Material Procurement", "Printing", "Finishing", "Quality Inspection", "Ready for Dispatch"];

export const sar = (n: number) => "SAR " + n.toLocaleString("en-US");
export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit", year: "numeric" }) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", opts);
export const orderById = (id: string) => orders.find((o) => o.id === id);
