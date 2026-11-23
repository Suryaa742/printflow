export type CheckResult = "pass" | "fail" | "warn" | "pending";
export interface CheckItem { area: string; criteria: string; spec: string; measured: string; result: CheckResult }

export function checklistFor(result: string): CheckItem[] {
  const base: CheckItem[] = [
    { area: "Print quality", criteria: "Registration, sharpness, ink density", spec: "Registration ±0.1mm", measured: "±0.08mm", result: "pass" },
    { area: "Colour accuracy", criteria: "Brand colours vs. approved proof", spec: "ΔE ≤ 2.0", measured: "ΔE 1.4", result: "pass" },
    { area: "Material quality", criteria: "Board grade, GSM, surface finish", spec: "350gsm ±3%", measured: "352gsm", result: "pass" },
    { area: "Dimensions", criteria: "Cut size and crease positions", spec: "±0.5mm", measured: "±0.3mm", result: "pass" },
    { area: "Packaging quality", criteria: "Folding, gluing, carton packing", spec: "0 critical defects", measured: "0 critical", result: "pass" },
  ];
  if (result === "Failed") { base[1] = { ...base[1]!, measured: "ΔE 4.2", result: "fail" }; base[0] = { ...base[0]!, measured: "±0.12mm", result: "warn" }; }
  if (result === "Conditional Pass") base[4] = { ...base[4]!, measured: "3 minor scuffs", result: "warn" };
  if (result === "Pending Review") { base[3] = { ...base[3]!, measured: "—", result: "pending" }; base[4] = { ...base[4]!, measured: "—", result: "pending" }; }
  return base;
}
