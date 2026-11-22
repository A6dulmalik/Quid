/**
 * Features that have UI insertion points but aren't built yet.
 *
 * Each entry renders as a disabled "Coming Soon" item wherever
 * `<ComingSoonBadge feature="..." />` or `<ComingSoonNavItem feature="..." />`
 * is used. When a feature ships, set `status: "live"` and replace the
 * placeholder at each `insertionPoints` path with the real component.
 */
export type UpcomingFeatureId = "proof-of-test" | "disputes" | "sep24-cashout";

export interface UpcomingFeature {
  id: UpcomingFeatureId;
  /** Short label for badges, nav items and tabs. */
  label: string;
  /** One sentence shown in tooltips and on the landing roadmap. */
  summary: string;
  status: "coming-soon" | "live";
  /** Files that hold a placeholder for this feature. */
  insertionPoints: string[];
}

export const UPCOMING_FEATURES: Record<UpcomingFeatureId, UpcomingFeature> = {
  "proof-of-test": {
    id: "proof-of-test",
    label: "On-Chain Proof-of-Test",
    summary:
      "Each approved test report is anchored on Soroban, so anyone can check who tested what and when.",
    status: "coming-soon",
    insertionPoints: [
      "src/features/creators/SubmissionCard.tsx",
      "src/components/creator/Sidebar.tsx",
      "src/features/landing/roadmap-section.tsx",
    ],
  },
  disputes: {
    id: "disputes",
    label: "Disputes",
    summary:
      "Hunters can contest a rejected report through the quid-dispute contract, with a timelock and an optional arbiter.",
    status: "coming-soon",
    insertionPoints: [
      "src/components/hunter/Sidebar.tsx",
      "src/components/creator/Sidebar.tsx",
      "src/features/landing/roadmap-section.tsx",
    ],
  },
  "sep24-cashout": {
    id: "sep24-cashout",
    label: "SEP-24 Cashout",
    summary:
      "Hunters can withdraw rewards to a bank account or mobile money through a Stellar anchor.",
    status: "coming-soon",
    insertionPoints: [
      "src/app/hunter/wallet/page.tsx",
      "src/components/hunter/Sidebar.tsx",
      "src/features/landing/roadmap-section.tsx",
    ],
  },
};

export const UPCOMING_FEATURE_LIST: UpcomingFeature[] = Object.values(UPCOMING_FEATURES);
