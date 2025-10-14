"use client";

import { Button } from "@base-church/ui/components/button";
import type { LucideIcon } from "lucide-react";

type LoadingStateProps = {
  icon: LucideIcon;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function LoadingState({
  icon: Icon,
  title = "Carregando...",
  description,
  actionLabel,
  onAction,
}: LoadingStateProps) {
  return (
    <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
      <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="dark-text-tertiary" size={32} />
      </div>
      <h1 className="dark-text-primary mb-2 text-2xl font-bold">{title}</h1>
      {description && <p className="dark-text-secondary">{description}</p>}
      {actionLabel && onAction && (
        <Button className="dark-btn-primary mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
