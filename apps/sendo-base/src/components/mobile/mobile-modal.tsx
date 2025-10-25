"use client";

import { Button } from "@base-church/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@base-church/ui/components/dialog";
import { cn } from "@base-church/ui/lib/utils";
import { LucideIcon } from "lucide-react";

interface MobileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function MobileModal({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  children,
  actions,
  className,
  size = "md",
}: MobileModalProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full mx-4",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "dark-bg-secondary border-0 sm:max-w-md",
          sizeClasses[size],
          className,
        )}
      >
        {(title || description || Icon) && (
          <DialogHeader className="pb-4">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="dark-primary-subtle-bg flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                  <Icon className="dark-primary h-5 w-5" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                {title && (
                  <DialogTitle className="dark-text-primary text-lg font-semibold">
                    {title}
                  </DialogTitle>
                )}
                {description && (
                  <DialogDescription className="dark-text-tertiary mt-1 text-sm">
                    {description}
                  </DialogDescription>
                )}
              </div>
            </div>
          </DialogHeader>
        )}

        <div className="space-y-4">{children}</div>

        {actions && (
          <DialogFooter className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row">
            {actions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface MobileConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  icon?: LucideIcon;
}

export function MobileConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  variant = "default",
  icon: Icon,
}: MobileConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <MobileModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon={Icon}
      size="sm"
      actions={
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={handleCancel} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="py-4 text-center">
        <p className="dark-text-secondary text-sm">{description}</p>
      </div>
    </MobileModal>
  );
}
