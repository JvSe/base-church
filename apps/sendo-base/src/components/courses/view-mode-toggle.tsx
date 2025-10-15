"use client";

import { Button } from "@base-church/ui/components/button";
import { Grid, List } from "lucide-react";

type ViewMode = "grid" | "list";

type ViewModeToggleProps = {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="dark-bg-secondary flex items-center rounded-lg p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("grid")}
        className={
          mode === "grid"
            ? "dark-btn-primary"
            : "dark-text-secondary hover:dark-text-primary"
        }
      >
        <Grid size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onChange("list")}
        className={
          mode === "list"
            ? "dark-btn-primary"
            : "dark-text-secondary hover:dark-text-primary"
        }
      >
        <List size={16} />
      </Button>
    </div>
  );
}
