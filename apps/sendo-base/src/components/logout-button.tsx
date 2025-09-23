"use client";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

import { cn } from "@repo/ui/lib/utils";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

export const LogoOutButton = ({
  className,
  variant = "verbose",
}: {
  className?: string;
  variant?: "icon" | "verbose";
}) => {
  async function onSignOut() {
    await fetch("/api/sign-out", {
      method: "POST",
    });

    toast.success("Desconectado com sucesso");
    localStorage.removeItem("@nextmed-app:referralTypeStore");
    // router.replace("/");
    window.location.href = "/";
  }

  return (
    <Dialog>
      <DialogTrigger
        className={cn("", className)}
        asChild
        data-testid="dialog-trigger"
      >
        <div className="flex cursor-pointer items-center gap-2">
          <Button
            size={"icon"}
            aria-label="signout"
            data-testid="signout-button"
            className="w-min gap-2 p-2"
          >
            <LogOut size={16} />
          </Button>
          {variant === "verbose" && (
            <p className="font-sf-pro-text font-bold">Sair</p>
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        role="dialog"
        className="dark:border-dark-border dark:bg-dark-background w-[calc(100%-40px)] rounded-lg border-2 border-white bg-[#F5F5F5] py-12 md:bg-white"
      >
        <DialogTitle className="sr-only">Deseja sair ?</DialogTitle>
        <DialogDescription className="sr-only">
          Deseja desconectar da aplicação ?
        </DialogDescription>
        <div className="mt-2 flex flex-col items-center justify-center gap-1">
          <p
            role="heading"
            aria-level={1}
            data-testid="signout-dialog-heading"
            className="font-sf-pro-display text-center text-2xl"
          >
            Tem certeza que <strong>deseja sair?</strong>
          </p>
          <div className="mt-4 flex w-full flex-col-reverse gap-4 md:flex-row">
            <DialogClose asChild>
              <Button variant="outline">Voltar</Button>
            </DialogClose>
            <Button onClick={onSignOut} variant="secondary">
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
