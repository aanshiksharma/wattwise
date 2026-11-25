"use client";

import { useRef, useState } from "react";
import { Plus, Trash2, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  appliances,
  evaluateBackup,
  rowEnergyWh,
  summarize,
  type Evaluation,
  type ApplianceConfig,
} from "@/features/calculator";

const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Empty input -> 0, otherwise a number clamped to [0, max]. */
function parseNumber(value: string, max = Infinity, integer = false): number {
  if (value === "") return 0;
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  const clamped = Math.min(Math.max(n, 0), max);
  return integer ? Math.floor(clamped) : clamped;
}

/** Show blank instead of 0 so the field can be cleared and retyped. */
const show = (n: number) => (n === 0 ? "" : n);

export function HeroCalculator() {
  const nextId = useRef(1);
  const [rows, setRows] = useState<ApplianceConfig[]>(() =>
    appliances.slice(0, 2).map((a) => ({ ...a })),
  );
  const [backupHours, setBackupHours] = useState(4);
  const [budget, setBudget] = useState(0); // 0 = no budget limit
  const [evaluation, setEvaluation] = useState<{
    key: string;
    result: Evaluation;
  } | null>(null);

  const summary = summarize(rows);
  const inputKey = JSON.stringify([
    summary.connectedLoadW,
    backupHours,
    budget,
  ]);
  const isStale = evaluation !== null && evaluation.key !== inputKey;
  const canEvaluate = summary.connectedLoadW > 0 && backupHours > 0;

  function updateRow(
    id: ApplianceConfig["id"],
    patch: Partial<ApplianceConfig>,
  ) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function removeRow(id: ApplianceConfig["id"]) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function addRow(preset?: ApplianceConfig) {
    const id = `row-${nextId.current++}`;
    setRows((prev) => [
      ...prev,
      preset
        ? { ...preset, id }
        : { id, name: "", quantity: 1, rating: 0, usage: 0 },
    ]);
  }

  function handleEvaluate() {
    if (!canEvaluate) return;
    setEvaluation({
      key: inputKey,
      result: evaluateBackup({
        loadW: summary.connectedLoadW,
        targetHours: backupHours,
        budget: budget > 0 ? budget : null,
      }),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Appliance inputs */}
        <Card>
          <CardHeader>
            <CardTitle>Your appliances</CardTitle>
            <CardDescription>
              Start from a common appliance or add your own. Quantity is in
              units, rating in watts and usage in hours per day.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {appliances.map((a) => (
                <Button
                  key={a.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="capitalize"
                  onClick={() => addRow(a)}
                >
                  <Plus />
                  {a.name}
                </Button>
              ))}
              <Button type="button" size="sm" onClick={() => addRow()}>
                <Plus />
                Custom
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-36">Appliance</TableHead>
                  <TableHead className="min-w-20">Qty</TableHead>
                  <TableHead className="w-24">Rating (W)</TableHead>
                  <TableHead className="w-24">Usage (h/day)</TableHead>
                  <TableHead className="w-28 text-right">
                    Energy (Wh/day)
                  </TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Remove</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No appliances yet. Pick one above to get started.
                    </TableCell>
                  </TableRow>
                )}
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Input
                        aria-label="Appliance name"
                        placeholder="Appliance name"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(row.id, { name: e.target.value })
                        }
                        className="capitalize"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        aria-label="Quantity"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        placeholder="0"
                        value={show(row.quantity)}
                        onChange={(e) =>
                          updateRow(row.id, {
                            quantity: parseNumber(e.target.value, 1000, true),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        aria-label="Rating in watts"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        placeholder="0"
                        value={show(row.rating)}
                        onChange={(e) =>
                          updateRow(row.id, {
                            rating: parseNumber(e.target.value, 100000),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        aria-label="Usage in hours per day"
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={24}
                        placeholder="0"
                        value={show(row.usage)}
                        onChange={(e) =>
                          updateRow(row.id, {
                            usage: parseNumber(e.target.value, 24),
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {fmt.format(rowEnergyWh(row))}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${row.name || "appliance"}`}
                        onClick={() => removeRow(row.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Live summary + evaluate */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Daily usage</CardTitle>
            <CardDescription>Updates as you type.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-semibold tabular-nums">
                  {fmt.format(summary.dailyKwh)}
                </span>
                <span className="text-lg text-muted-foreground">kWh / day</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                {fmt.format(summary.dailyWh)} Wh per day, about{" "}
                {fmt.format(summary.dailyKwh * 30)} units a month
              </p>
            </div>

            <div className="flex items-center justify-between rounded-md bg-secondary px-3 py-2 text-sm">
              <span className="text-muted-foreground">Connected load</span>
              <span className="font-medium tabular-nums">
                {fmt.format(summary.connectedLoadW)} W
              </span>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="backup-hours">Backup needed (hours)</Label>
                <Input
                  id="backup-hours"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={48}
                  placeholder="4"
                  value={show(backupHours)}
                  onChange={(e) =>
                    setBackupHours(parseNumber(e.target.value, 48))
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="budget">Budget (₹, optional)</Label>
                <Input
                  id="budget"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="No limit"
                  value={show(budget)}
                  onChange={(e) =>
                    setBudget(parseNumber(e.target.value, 10000000, true))
                  }
                />
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={!canEvaluate}
              onClick={handleEvaluate}
            >
              <Zap />
              Evaluate
            </Button>
          </CardContent>
        </Card>
      </div>

      {evaluation && (
        <Results evaluation={evaluation.result} isStale={isStale} />
      )}
    </div>
  );
}

function Results({
  evaluation,
  isStale,
}: {
  evaluation: Evaluation;
  isStale: boolean;
}) {
  const { status, matches, loadW, targetHours, budget } = evaluation;

  const message: Record<Evaluation["status"], string> = {
    ok:
      budget !== null
        ? `Options that run your ${fmt.format(loadW)} W load for ${fmt.format(targetHours)} h within ${inr.format(budget)}.`
        : `Options that run your ${fmt.format(loadW)} W load for ${fmt.format(targetHours)} h, cheapest first.`,
    "over-budget": `Nothing suitable fits within ${budget !== null ? inr.format(budget) : "your budget"}. These are the cheapest options that meet your need, so consider raising the budget, lowering the backup hours or removing some appliances.`,
    short: `No option lasts ${fmt.format(targetHours)} h at ${fmt.format(loadW)} W. These last the longest while handling your load, so try fewer appliances or fewer backup hours.`,
    overload: `Your connected load of ${fmt.format(loadW)} W is above what any option here can handle. Remove some appliances or book a professional assessment.`,
  };

  return (
    <section aria-labelledby="results-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="results-heading" className="text-xl font-semibold">
          Suggested power backup
        </h2>
        <p className="text-sm text-muted-foreground">{message[status]}</p>
        {isStale && (
          <p className="text-sm font-medium text-accent-foreground">
            Your inputs have changed. Press Evaluate to refresh these
            suggestions.
          </p>
        )}
      </div>

      {matches.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {matches.map(({ option, usableWh, backupHours }, i) => {
            const meetsTarget = backupHours >= targetHours;
            return (
              <Card key={option.id} className="gap-4">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{option.type}</Badge>
                    {status === "ok" && i === 0 && <Badge>Best match</Badge>}
                    {status === "over-budget" && (
                      <Badge variant="outline">Over budget</Badge>
                    )}
                    {!meetsTarget && (
                      <Badge variant="outline">Runs short</Badge>
                    )}
                  </div>
                  <CardTitle className="pt-1 text-base leading-snug">
                    {option.name}
                  </CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div>
                    <span className="text-3xl font-semibold tabular-nums">
                      {fmt.format(backupHours)}
                    </span>
                    <span className="ml-1 text-muted-foreground">
                      h backup at your load
                    </span>
                  </div>
                  <dl className="grid grid-cols-2 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Indicative price</dt>
                    <dd className="text-right font-medium tabular-nums">
                      {inr.format(option.price)}
                    </dd>
                    <dt className="text-muted-foreground">Usable energy</dt>
                    <dd className="text-right tabular-nums">
                      {fmt.format(usableWh)} Wh
                    </dd>
                    <dt className="text-muted-foreground">Max load</dt>
                    <dd className="text-right tabular-nums">
                      {fmt.format(option.maxLoadW)} W
                    </dd>
                  </dl>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
