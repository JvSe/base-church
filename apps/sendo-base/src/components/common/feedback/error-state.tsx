"use client";

import { Button } from "@base-church/ui/components/button";
import type { LucideIcon } from "lucide-react";

type ErrorStateProps = {
  icon: LucideIcon;
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

export function ErrorState({
  icon: Icon,
  title = "Ocorreu um erro",
  description = "Tente novamente mais tarde.",
  retryLabel = "Tentar Novamente",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
      <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="dark-text-tertiary" size={32} />
      </div>
      <h1 className="dark-text-primary mb-2 text-2xl font-bold">{title}</h1>
      {description && <p className="dark-text-secondary mb-4">{description}</p>}
      {onRetry && (
        <Button className="dark-btn-primary" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
