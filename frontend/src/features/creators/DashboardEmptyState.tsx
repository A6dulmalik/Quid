import React from "react";
import { FileText, Plus } from "lucide-react";
import { EmptyState as SharedEmptyState } from "@/components/ui/empty-state";

export interface DashboardEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<DashboardEmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <SharedEmptyState
      title={title}
      description={description}
      icon={icon}
      variant="card"
      action={
        actionLabel && onAction
          ? {
              label: actionLabel,
              onClick: onAction,
              icon: Plus,
            }
          : undefined
      }
    />
  );
};

// Specific empty states
export const NoQuestsEmptyState: React.FC<{ onCreateQuest: () => void }> = ({
  onCreateQuest,
}) => {
  return (
    <EmptyState
      title="No Active Missions"
      description="You haven't created any missions yet. Create your first mission to start receiving test reports from hunters."
      actionLabel="Create Your First Mission"
      onAction={onCreateQuest}
      icon={<FileText className="size-8 text-purple-400" />}
    />
  );
};

export const NoResponsesEmptyState: React.FC = () => {
  return (
    <EmptyState
      title="No Responses Yet"
      description="You don't have any reports yet. Hunters will appear here once they start submitting reports to your missions."
      icon={<FileText className="size-8 text-blue-400" />}
    />
  );
};

export default EmptyState;