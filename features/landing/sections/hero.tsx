import { HeroCalculator } from "@/features/calculator";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 flex flex-col items-center gap-20">
      <div className="text-center flex flex-col items-center gap-8">
        <h1 className="text-5xl font-semibold font-heading tracking-tight text-balance sm:text-7xl">
          Know your power usage.
          <br />
          Pick a backup that lasts.
        </h1>
        <p className="text-muted-foreground text-pretty max-w-2xl">
          List the appliances you want running during a power cut and see your
          daily usage as you type. Press Evaluate to get backup options that fit
          your load, hours and budget.
        </p>
      </div>

      <HeroCalculator />
    </section>
  );
}
