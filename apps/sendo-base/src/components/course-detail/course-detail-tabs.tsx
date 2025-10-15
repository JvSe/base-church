"use client";

import { Button } from "@base-church/ui/components/button";

type CourseTab = "overview" | "curriculum" | "instructor" | "reviews";

type CourseDetailTabsProps = {
  activeTab: CourseTab;
  onTabChange: (tab: CourseTab) => void;
};

const tabs = [
  { id: "overview" as const, label: "Visão Geral" },
  { id: "curriculum" as const, label: "Conteúdo" },
  { id: "instructor" as const, label: "Instrutor" },
  { id: "reviews" as const, label: "Avaliações" },
];

export function CourseDetailTabs({
  activeTab,
  onTabChange,
}: CourseDetailTabsProps) {
  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-1">
      <div className="flex items-center space-x-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => onTabChange(tab.id)}
            className={`${
              activeTab === tab.id
                ? "dark-btn-primary"
                : "dark-text-secondary hover:dark-text-primary"
            }`}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
