"use client";

import { Button } from "@base-church/ui/components/button";
import { Card, CardContent, CardHeader } from "@base-church/ui/components/card";
import { cn } from "@base-church/ui/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface MobileDataTableProps {
  data: Array<Record<string, any>>;
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    mobile?: {
      label: string;
      priority: "high" | "medium" | "low";
    };
  }>;
  className?: string;
  title?: string;
  searchable?: boolean;
  onSearch?: (term: string) => void;
}

export function MobileDataTable({
  data,
  columns,
  className,
  title,
  searchable = false,
  onSearch,
}: MobileDataTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  const toggleRow = (rowId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  });

  const highPriorityColumns = columns.filter(
    (col) => col.mobile?.priority === "high",
  );
  const mediumPriorityColumns = columns.filter(
    (col) => col.mobile?.priority === "medium",
  );
  const lowPriorityColumns = columns.filter(
    (col) => col.mobile?.priority === "low",
  );

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="dark-text-primary text-lg font-semibold">{title}</h3>
      )}

      {searchable && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="dark-input w-full rounded-lg px-3 py-2 text-sm"
          />
        </div>
      )}

      <div className="space-y-2">
        {filteredData.map((row, index) => {
          const rowId = row.id || index.toString();
          const isExpanded = expandedRows.has(rowId);

          return (
            <Card key={rowId} className="dark-bg-secondary border-0">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    {highPriorityColumns.map((col) => {
                      const value = row[col.key];
                      return (
                        <div key={col.key} className="truncate">
                          {col.render ? col.render(value, row) : String(value)}
                        </div>
                      );
                    })}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRow(rowId)}
                    className="dark-text-secondary hover:dark-text-primary ml-2 flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {mediumPriorityColumns.map((col) => {
                      const value = row[col.key];
                      return (
                        <div key={col.key} className="space-y-1">
                          <div className="dark-text-tertiary text-xs font-medium uppercase tracking-wide">
                            {col.mobile?.label || col.label}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            {col.render
                              ? col.render(value, row)
                              : String(value)}
                          </div>
                        </div>
                      );
                    })}

                    {lowPriorityColumns.length > 0 && (
                      <div className="border-t border-white/10 pt-2">
                        <div className="space-y-2">
                          {lowPriorityColumns.map((col) => {
                            const value = row[col.key];
                            return (
                              <div key={col.key} className="space-y-1">
                                <div className="dark-text-tertiary text-xs font-medium uppercase tracking-wide">
                                  {col.mobile?.label || col.label}
                                </div>
                                <div className="dark-text-secondary text-sm">
                                  {col.render
                                    ? col.render(value, row)
                                    : String(value)}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="py-8 text-center">
          <div className="dark-text-tertiary text-sm">
            {searchTerm
              ? "Nenhum resultado encontrado"
              : "Nenhum item encontrado"}
          </div>
        </div>
      )}
    </div>
  );
}
