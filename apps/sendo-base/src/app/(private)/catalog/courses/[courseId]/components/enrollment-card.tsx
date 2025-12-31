"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@base-church/ui/components/avatar";
import { Button } from "@base-church/ui/components/button";
import { CheckCircle, Info, Play } from "lucide-react";

type EnrollmentStatus = "none" | "pending" | "approved" | "rejected";

type EnrollmentCardProps = {
  status: EnrollmentStatus;
  rejectionReason?: string;
  onEnroll: () => void;
  isLoading?: boolean;
  image?: string;
};

export function EnrollmentCard({
  status,
  rejectionReason,
  onEnroll,
  isLoading = false,
  image,
}: EnrollmentCardProps) {
  return (
    <div className="dark-card dark-shadow-sm relative rounded-xl p-6">
      <div className="h-48">
        <div className="absolute inset-0 h-full w-full">
          <div className="relative h-48 w-full">
            <Avatar className="h-full w-full rounded-none rounded-t-lg object-contain ring-2 ring-transparent transition-all duration-200">
              <AvatarImage
                src={image ?? ""}
                alt={"Foto do Curso"}
                className="object-cover"
              />
              <AvatarFallback className="dark-primary-subtle-bg rounded-full p-4">
                {/* <User className="dark-primary" size={32} /> */}
              </AvatarFallback>
            </Avatar>
            <div className="bg-dark-bg-tertiary/50 absolute inset-0 z-10 mb-4 flex h-48 items-center justify-center rounded-t-lg">
              <Play className="dark-text-tertiary" size={48} />
            </div>
          </div>
        </div>
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
