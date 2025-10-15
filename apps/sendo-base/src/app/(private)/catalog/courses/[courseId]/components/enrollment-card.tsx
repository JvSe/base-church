"use client";

import { Button } from "@base-church/ui/components/button";
import { CheckCircle, Info, Play } from "lucide-react";

type EnrollmentStatus = "none" | "pending" | "approved" | "rejected";

type EnrollmentCardProps = {
  status: EnrollmentStatus;
  rejectionReason?: string;
  onEnroll: () => void;
  isLoading?: boolean;
};

export function EnrollmentCard({
  status,
  rejectionReason,
  onEnroll,
  isLoading = false,
}: EnrollmentCardProps) {
  return (
    <div className="dark-card dark-shadow-sm rounded-xl p-6">
      <div className="dark-bg-tertiary mb-4 flex h-48 items-center justify-center rounded-lg">
        <Play className="dark-text-tertiary" size={48} />
      </div>

      <div className="space-y-4">
        {status === "none" && (
          <Button
            className="dark-btn-primary w-full"
            onClick={onEnroll}
            disabled={isLoading}
          >
            <Play className="mr-2" size={16} />
            {isLoading ? "Enviando..." : "Solicitar Matrícula"}
          </Button>
        )}

        {status === "pending" && (
          <div className="dark-warning-bg dark-warning rounded-lg p-4 text-center">
            <Info className="mx-auto mb-2" size={20} />
            <p className="text-sm font-medium">Solicitação Pendente</p>
            <p className="text-xs opacity-80">Aguarde aprovação dos líderes</p>
          </div>
        )}

        {status === "approved" && (
          <div className="dark-success-bg dark-success rounded-lg p-4 text-center">
            <CheckCircle className="mx-auto mb-2" size={20} />
            <p className="text-sm font-medium">Matrícula Aprovada</p>
            <p className="text-xs opacity-80">Você tem acesso ao curso</p>
          </div>
        )}

        {status === "rejected" && (
          <div className="dark-error-bg dark-error rounded-lg p-4 text-center">
            <Info className="mx-auto mb-2" size={20} />
            <p className="text-sm font-medium">Matrícula Rejeitada</p>
            <p className="text-xs opacity-80">
              {rejectionReason || "Motivo não informado"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
