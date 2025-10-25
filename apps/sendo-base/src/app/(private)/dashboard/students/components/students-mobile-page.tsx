"use client";

import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import {
  MobilePageWrapper,
  MobileStudentsTable,
} from "@/src/components/mobile";
import { useResponsive } from "@/src/hooks";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { Download, Filter, Plus, Search } from "lucide-react";
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

interface StudentsMobilePageProps {
  students: Student[];
  onViewDetails: (student: Student) => void;
  onApprove: (studentId: string) => void;
  onReject: (studentId: string) => void;
  onGenerateLink: (studentId: string) => void;
  onExport: () => void;
  onCreateStudent: () => void;
  isLoading?: boolean;
}

export function StudentsMobilePage({
  students,
  onViewDetails,
  onApprove,
  onReject,
  onGenerateLink,
  onExport,
  onCreateStudent,
  isLoading = false,
}: StudentsMobilePageProps) {
  const { isMobile } = useResponsive();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    pending: students.filter((s) => s.approvalStatus === "PENDING").length,
    completed: students.filter((s) => s.coursesCompleted > 0).length,
  };

  // Use MobilePageWrapper for mobile, regular PageLayout for desktop
  const ContentWrapper = isMobile ? MobilePageWrapper : PageLayout;

  return (
    <ContentWrapper title="Gerenciar Alunos">
      {!isMobile && (
        <PageHeader
          title="Gerenciar Alunos"
          description="Visualize e gerencie todos os alunos da plataforma"
          actions={[
            {
              label: "Novo Aluno",
              onClick: onCreateStudent,
              variant: "default",
              icon: Plus,
            },
            {
              label: "Exportar",
              onClick: onExport,
              variant: "outline",
              icon: Download,
            },
          ]}
        />
      )}

      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="dark-bg-secondary rounded-xl p-4 text-center">
          <div className="dark-text-primary text-2xl font-bold">
            {stats.total}
          </div>
          <div className="dark-text-tertiary text-sm">Total</div>
        </div>
        <div className="dark-bg-secondary rounded-xl p-4 text-center">
          <div className="dark-text-primary text-2xl font-bold text-green-400">
            {stats.active}
          </div>
          <div className="dark-text-tertiary text-sm">Ativos</div>
        </div>
        <div className="dark-bg-secondary rounded-xl p-4 text-center">
          <div className="dark-text-primary text-2xl font-bold text-yellow-400">
            {stats.pending}
          </div>
          <div className="dark-text-tertiary text-sm">Pendentes</div>
        </div>
        <div className="dark-bg-secondary rounded-xl p-4 text-center">
          <div className="dark-text-primary text-2xl font-bold text-blue-400">
            {stats.completed}
          </div>
          <div className="dark-text-tertiary text-sm">Completaram</div>
        </div>
      </div>

      {/* Filters */}
      <div className="dark-bg-secondary mb-6 rounded-xl p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="dark-text-tertiary absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="dark-input pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="dark-input">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="inactive">Inativos</SelectItem>
                <SelectItem value="suspended">Suspensos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      {isMobile && (
        <div className="mb-6 flex gap-3">
          <Button onClick={onCreateStudent} className="dark-btn-primary flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
          <Button onClick={onExport} variant="outline" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      )}

      {/* Mobile Table */}
      <MobileStudentsTable
        students={filteredStudents}
        onViewDetails={onViewDetails}
        onApprove={onApprove}
        onReject={onReject}
        onGenerateLink={onGenerateLink}
        isLoading={isLoading}
      />
    </ContentWrapper>
  );
}
