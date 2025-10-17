"use client";

import type { SupportOption } from "@/src/lib/types";
import { Button } from "@base-church/ui/components/button";
import * as LucideIcons from "lucide-react";
import { Clock } from "lucide-react";

type SupportOptionCardProps = {
  option: SupportOption;
};

export function SupportOptionCard({ option }: SupportOptionCardProps) {
  // Get icon component dynamically
  const IconComponent =
    (LucideIcons as any)[option.icon] || LucideIcons.HelpCircle;

  return (
    <div
      className={`dark-card dark-shadow-sm rounded-xl p-6 text-center ${!option.isAvailable && "opacity-60"}`}
    >
      <div className="dark-primary-subtle-bg mx-auto mb-4 w-fit rounded-full p-4">
        <IconComponent className="dark-primary" size={32} />
      </div>
      <h3 className="dark-text-primary mb-2 text-lg font-semibold">
        {option.title}
      </h3>
      <p className="dark-text-secondary mb-4">{option.description}</p>
      <div className="mb-4 flex items-center justify-center gap-1">
        <Clock size={14} className="dark-text-tertiary" />
        <span className="dark-text-tertiary text-sm">
          {option.responseTime}
        </span>
      </div>
      <Button
        className={
          option.isAvailable
            ? "dark-btn-primary w-full"
            : "dark-text-disabled w-full cursor-not-allowed"
        }
        disabled={!option.isAvailable}
      >
        {option.action}
      </Button>
    </div>
  );
}
