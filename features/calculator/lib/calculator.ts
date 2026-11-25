import {
  ApplianceConfig,
  backupOptions,
  type BackupOption,
} from "@/features/calculator";

/** Energy used by one appliance row per day, in Wh. */
export function rowEnergyWh(a: ApplianceConfig): number {
  return a.quantity * a.rating * a.usage;
}

export type Summary = {
  dailyWh: number;
  dailyKwh: number;
  connectedLoadW: number;
};

/** Daily energy (Wh) = sum of [quantity x power (W) x hours of use]. */
export function summarize(rows: ApplianceConfig[]): Summary {
  const dailyWh = rows.reduce((sum, a) => sum + rowEnergyWh(a), 0);
  const connectedLoadW = rows.reduce(
    (sum, a) => sum + a.quantity * a.rating,
    0,
  );
  return { dailyWh, dailyKwh: dailyWh / 1000, connectedLoadW };
}

/** Usable battery energy (Wh) = V x Ah x depth of discharge x efficiency. */
export function usableEnergyWh(o: BackupOption): number {
  return o.voltage * o.capacityAh * o.depthOfDischarge * o.efficiency;
}

export type OptionResult = {
  option: BackupOption;
  usableWh: number;
  /** Backup time (h) = usable energy / connected load. */
  backupHours: number;
};

export type EvaluationStatus =
  | "ok" // suitable options found within budget (or no budget set)
  | "over-budget" // suitable options exist, but all cost more than the budget
  | "short" // options handle the load, but none lasts long enough
  | "overload"; // load is higher than every option can handle

export type Evaluation = {
  status: EvaluationStatus;
  loadW: number;
  targetHours: number;
  budget: number | null;
  matches: OptionResult[];
};

export function evaluateBackup(input: {
  loadW: number;
  targetHours: number;
  budget: number | null;
}): Evaluation {
  const { loadW, targetHours, budget } = input;

  const all: OptionResult[] = backupOptions.map((option) => {
    const usableWh = usableEnergyWh(option);
    return { option, usableWh, backupHours: usableWh / loadW };
  });

  const canHandleLoad = all.filter((r) => r.option.maxLoadW >= loadW);
  const suitable = canHandleLoad
    .filter((r) => r.backupHours >= targetHours)
    .sort((a, b) => a.option.price - b.option.price);

  const base = { loadW, targetHours, budget };

  if (canHandleLoad.length === 0) {
    return { ...base, status: "overload", matches: [] };
  }

  if (suitable.length === 0) {
    const longest = [...canHandleLoad]
      .sort((a, b) => b.backupHours - a.backupHours)
      .slice(0, 2);
    return { ...base, status: "short", matches: longest };
  }

  if (budget !== null) {
    const inBudget = suitable.filter((r) => r.option.price <= budget);
    if (inBudget.length > 0) {
      return { ...base, status: "ok", matches: inBudget.slice(0, 3) };
    }
    return { ...base, status: "over-budget", matches: suitable.slice(0, 3) };
  }

  return { ...base, status: "ok", matches: suitable.slice(0, 3) };
}
