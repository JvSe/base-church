"use client";

import { Button } from "@base-church/ui/components/button";
import { CheckCircle2 } from "lucide-react";

type TextLessonContentProps = {
  content: string;
  isCompleted: boolean;
  isUpdatingProgress: boolean;
  onComplete: () => void;
};

export function TextLessonContent({
  content,
  isCompleted,
  isUpdatingProgress,
  onComplete,
}: TextLessonContentProps) {
  return (
    <div className="dark-bg-secondary flex h-full flex-col">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="dark-bg-primary dark-border mx-auto max-w-4xl rounded-lg border p-8 shadow-sm">
          {/* Render content with basic formatting */}
          <div className="dark-text-primary prose prose-slate dark:prose-invert max-w-none">
            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                fontSize: "1.05rem",
              }}
            >
              {content}
            </div>
          </div>
        </div>
      </div>

      {/* Complete Button */}
      {!isCompleted && (
        <div className="dark-bg-primary dark-border flex-shrink-0 border-t p-4">
          <div className="mx-auto max-w-4xl">
            <Button
              onClick={onComplete}
              disabled={isUpdatingProgress}
              className="w-full"
              size="lg"
            >
              {isUpdatingProgress ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Marcar como Concluído
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
