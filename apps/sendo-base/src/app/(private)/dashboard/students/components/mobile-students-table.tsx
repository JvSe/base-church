"use client";

import { MobileDataTable } from "@/src/components/mobile";
import { Badge } from "@base-church/ui/components/badge";
import { Button } from "@base-church/ui/components/button";
import {
  CheckCircle,
  Clock,
  Eye,
  Link2,
  Mail,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  cpf: string;
  joinDate: Date;
  role: "MEMBROS" | "ADMIN" | "LIDER";
  isPastor: boolean;
  profileCompletion: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  lastActivity: Date;
  status: "active" | "inactive" | "suspended";
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

interface MobileStudentsTableProps {
  students: Student[];
  onViewDetails: (student: Student) => void;
  onApprove: (studentId: string) => void;
  onReject: (studentId: string) => void;
  onGenerateLink: (studentId: string) => void;
  isLoading?: boolean;
}

export function MobileStudentsTable({
  students,
  onViewDetails,
  onApprove,
  onReject,
  onGenerateLink,
  isLoading = false,
}: MobileStudentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusBadge = (status: string, approvalStatus?: string) => {
    if (approvalStatus === "PENDING") {
      return (
        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
          <Clock className="mr-1 h-3 w-3" />
          Pendente
        </Badge>
      );
    }

    if (approvalStatus === "REJECTED") {
      return (
        <Badge variant="destructive" className="bg-red-500/20 text-red-400">
          <XCircle className="mr-1 h-3 w-3" />
          Rejeitado
        </Badge>
      );
    }

    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Ativo
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">
            Inativo
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="destructive" className="bg-red-500/20 text-red-400">
            Suspenso
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string, isPastor: boolean) => {
    if (isPastor) return "Pastor";
    switch (role) {
      case "ADMIN":
        return "Administrador";
      case "LIDER":
        return "Líder";
      case "MEMBROS":
        return "Membro";
      default:
        return role;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Nome",
      mobile: { label: "Nome", priority: "high" as const },
      render: (value: string, row: Student) => (
        <div className="flex items-center space-x-2">
          <div className="dark-primary-subtle-bg flex h-8 w-8 items-center justify-center rounded-full">
            <User className="dark-primary h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="dark-text-primary truncate text-sm font-medium">
              {value}
            </div>
            <div className="dark-text-tertiary text-xs">
              {getRoleLabel(row.role, row.isPastor)}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      mobile: { label: "Email", priority: "medium" as const },
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Mail className="dark-text-tertiary h-3 w-3" />
          <span className="dark-text-secondary truncate text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Telefone",
      mobile: { label: "Telefone", priority: "medium" as const },
      render: (value: string | null) => (
        <div className="flex items-center space-x-2">
          <Phone className="dark-text-tertiary h-3 w-3" />
          <span className="dark-text-secondary text-sm">
            {value || "Não informado"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      mobile: { label: "Status", priority: "high" as const },
      render: (value: string, row: Student) =>
        getStatusBadge(value, row.approvalStatus),
    },
    {
      key: "coursesEnrolled",
      label: "Cursos",
      mobile: { label: "Cursos Matriculados", priority: "medium" as const },
      render: (value: number) => (
        <div className="dark-text-secondary text-sm">
          {value} matriculado{value !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "coursesCompleted",
      label: "Completados",
      mobile: { label: "Cursos Completados", priority: "medium" as const },
      render: (value: number) => (
        <div className="dark-text-secondary text-sm">
          {value} completado{value !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "certificatesEarned",
      label: "Certificados",
      mobile: { label: "Certificados", priority: "low" as const },
      render: (value: number) => (
        <div className="dark-text-secondary text-sm">
          {value} certificado{value !== 1 ? "s" : ""}
        </div>
      ),
    },
    {
      key: "joinDate",
      label: "Data de Cadastro",
      mobile: { label: "Data de Cadastro", priority: "low" as const },
      render: (value: Date) => (
        <div className="dark-text-secondary text-sm">{formatDate(value)}</div>
      ),
    },
    {
      key: "actions",
      label: "Ações",
      mobile: { label: "Ações", priority: "high" as const },
      render: (value: any, row: Student) => (
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(row)}
            className="h-8 px-2 text-xs"
          >
            <Eye className="h-3 w-3" />
          </Button>

          {row.approvalStatus === "PENDING" && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove(row.id)}
                className="h-8 bg-green-600 px-2 text-xs hover:bg-green-700"
              >
                <CheckCircle className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onReject(row.id)}
                className="h-8 px-2 text-xs"
              >
                <XCircle className="h-3 w-3" />
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onGenerateLink(row.id)}
            className="h-8 px-2 text-xs"
          >
            <Link2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="dark-bg-secondary animate-pulse rounded-xl p-4"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gray-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-700"></div>
                <div className="h-3 w-1/2 rounded bg-gray-700"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <MobileDataTable
      data={students}
      columns={columns}
      title="Lista de Alunos"
      searchable
      onSearch={setSearchTerm}
    />
  );
}
