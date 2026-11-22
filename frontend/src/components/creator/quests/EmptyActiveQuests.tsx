import { EmptyState } from "@/components/ui/empty-state";
import { Plus } from "lucide-react";

export default function EmptyActiveQuests() {
  return (
    <EmptyState
      title="No Active Missions"
      description="You have no active quests at the moment. Click below to create a quest."
      action={{
        label: "Add New Mission",
        href: "/creator/quests/new",
        icon: Plus,
      }}
    />
  );
}
