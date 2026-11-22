import { ComingSoonBadge } from "@/components/ui/coming-soon";
import { UPCOMING_FEATURES } from "@/lib/upcoming-features";

export default function HunterWalletPage() {
  const cashout = UPCOMING_FEATURES["sep24-cashout"];

  return (
    <div className="min-h-screen bg-background brutal-grid-bg px-6 py-10 text-foreground">
      <p className="text-sm uppercase tracking-[0.24em] text-foreground">
        Hunter
      </p>
      <h1 className="mt-3 text-3xl font-semibold">Wallet</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Your mission earnings and payout history will be managed from this view.
      </p>

      {/* SEP-24 cashout insertion point. Replace this card with the anchor
          flow once `sep24-cashout` is live in lib/upcoming-features.ts. */}
      {cashout.status !== "live" && (
        <section
          aria-labelledby="cashout-heading"
          className="mt-8 max-w-xl brutal-border brutal-shadow bg-card p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="cashout-heading"
              className="text-sm font-black uppercase tracking-wide"
            >
              Cash out to fiat
            </h2>
            <ComingSoonBadge feature="sep24-cashout" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{cashout.summary}</p>
          <button
            type="button"
            disabled
            className="mt-4 h-11 cursor-not-allowed brutal-border bg-muted px-4 text-sm font-bold uppercase tracking-wide text-muted-foreground"
          >
            Cash out via anchor
          </button>
        </section>
      )}
    </div>
  );
}
