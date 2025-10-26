"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { Section } from "@/src/components/common/layout/section";
import { useAuth, usePageTitle } from "@/src/hooks";
import {
  approveEnrollment,
  deleteStudent,
  generateAccessLink,
  getAllStudents,
  getStudentEnrollments,
  getStudentStats,
  rejectEnrollment,
  updateStudentStatus,
  updateUserPastorStatus,
  updateUserRole,
} from "@/src/lib/actions";
import { addPastorPrefix } from "@/src/lib/helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@base-church/ui/components/accordion";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import { Textarea } from "@base-church/ui/components/textarea";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Link2,
  Loader2,
  Mail,
  Phone,
  Search,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

interface Enrollment {
  id: string;
  status: string;
  enrolledAt: Date;
  approvedAt?: Date | null;
  rejectionReason?: string | null;
  course: {
    id: string;
    title: string;
    instructor?: {
      name: string | null;
    } | null;
  };
  approver?: {
    name: string | null;
  } | null;
}

export default function StudentsPage() {
  usePageTitle("Gerenciar Alunos");

  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentEnrollment, setCurrentEnrollment] = useState<Enrollment | null>(
    null,
  );
  const [showEnrollments, setShowEnrollments] = useState<
    Record<string, boolean>
  >({});
  const [pendingInitialized, setPendingInitialized] = useState(false);
  const [generatingLinkFor, setGeneratingLinkFor] = useState<string | null>(
    null,
  );

  const { user } = useAuth();

  // Buscar dados dos alunos
  const {
    data: studentsData,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["students"],
    queryFn: getAllStudents,
    select: (data) => data.students,
  });

  // Buscar estatísticas dos alunos
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["student-stats"],
    queryFn: getStudentStats,
    select: (data) => data.stats,
  });

  // Buscar matrículas do aluno selecionado
  const {
    data: enrollmentsData,
    isLoading: enrollmentsLoading,
    refetch: refetchEnrollments,
  } = useQuery({
    queryKey: ["student-enrollments", selectedStudent?.id],
    queryFn: () => getStudentEnrollments(selectedStudent!.id),
    select: (data) => data.enrollments,
    enabled: !!selectedStudent,
  });

  // Buscar matrículas de todos os alunos para mostrar badges de pendências
  const { data: allEnrollmentsData, isLoading: allEnrollmentsLoading } =
    useQuery({
      queryKey: ["all-enrollments"],
      queryFn: async () => {
        const enrollments = await Promise.all(
          filteredStudents.map(async (student) => {
            const result = await getStudentEnrollments(student.id).catch(
              () => ({ enrollments: [] }),
            );
            return (result.enrollments || []).map((enrollment) => ({
              ...enrollment,
              studentId: student.id,
            }));
          }),
        );
        return enrollments.flat();
      },
      enabled: filteredStudents.length > 0,
    });

  useEffect(() => {
    if (studentsData) {
      const filtered = studentsData.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.cpf.includes(searchTerm),
      );

      // Ordenar alunos: primeiro os com matrículas pendentes, depois os demais
      const sorted = filtered.sort((a, b) => {
        const aHasPending = getStudentPendingEnrollments(a.id).length > 0;
        const bHasPending = getStudentPendingEnrollments(b.id).length > 0;

        // Se ambos têm ou não têm pendências, manter ordem alfabética
        if (aHasPending === bHasPending) {
          return a.name.localeCompare(b.name);
        }

        // Priorizar alunos com matrículas pendentes
        return aHasPending ? -1 : 1;
      });

      setFilteredStudents(sorted);
    }
  }, [searchTerm, studentsData, allEnrollmentsData]);

  const getStatusColor = (status: Student["approvalStatus"]) => {
    switch (status) {
      case "APPROVED":
        return "text-green-400 bg-green-400/20";
      case "PENDING":
        return "text-yellow-400 bg-yellow-400/20";
      case "REJECTED":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusText = (status: Student["approvalStatus"]) => {
    switch (status) {
      case "APPROVED":
        return "Ativo";
      case "PENDING":
        return "Inativo";
      case "REJECTED":
        return "Suspenso";
      default:
        return "Desconhecido";
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    if (minutes > 0) return `${minutes}min atrás`;
    return "Agora";
  };

  // Funções para gerenciar alunos
  const handleUpdateStudentStatus = async (
    studentId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      const result = await updateStudentStatus(studentId, status);
      if (result.success) {
        toast.success(result.message);
        refetchStudents();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar status do aluno");
    }
  };

  const handleDeleteStudent = async (
    studentId: string,
    studentName: string,
  ) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir o aluno ${studentName}? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }

    try {
      const result = await deleteStudent(studentId);
      if (result.success) {
        toast.success(result.message);
        refetchStudents();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao excluir aluno");
    }
  };

  const handleGenerateAccessLink = async (
    studentId: string,
    studentName: string,
  ) => {
    setGeneratingLinkFor(studentId);

    try {
      const result = await generateAccessLink(studentId, user?.id || "");

      if (result.success && "inviteLink" in result && result.inviteLink) {
        // Copiar para clipboard
        await navigator.clipboard.writeText(result.inviteLink);

        // Mensagens diferentes baseadas no tipo de link
        const isPasswordReset =
          "linkType" in result && result.linkType === "password-reset";
        const title = isPasswordReset
          ? "Link de reset de senha copiado!"
          : "Link de acesso copiado!";
        const description = isPasswordReset
          ? `O link de reset de senha para ${studentName} foi copiado. O usuário poderá redefinir sua senha com este link. Válido por 7 dias.`
          : `O link de acesso para ${studentName} foi copiado. O usuário poderá completar o cadastro com CPF e senha. Válido por 7 dias.`;

        // Mostrar toast de sucesso
        toast.success(title, {
          description,
          duration: 5000,
        });
      } else {
        toast.error("Erro ao gerar link", {
          description: result.error || "Tente novamente mais tarde",
        });
      }
    } catch (error) {
      toast.error("Erro ao gerar link de acesso", {
        description: "Verifique sua conexão e tente novamente",
      });
    } finally {
      setGeneratingLinkFor(null);
    }
  };

  // Funções para gerenciar matrículas
  const handleApproveEnrollment = async (enrollmentId: string) => {
    try {
      // TODO: Obter ID do usuário atual (líder/pastor que está aprovando)
      const approverId = user?.id || ""; // Substituir por ID real do usuário logado

      const result = await approveEnrollment(enrollmentId, approverId);
      if (result.success) {
        toast.success(result.message);
        refetchEnrollments();
      }
    } catch (error) {
      toast.error("Erro ao aprovar matrícula");
    }
  };

  const handleRejectEnrollment = async (enrollmentId: string) => {
    if (!rejectReason.trim()) {
      toast.error("Por favor, informe o motivo da rejeição");
      return;
    }

    try {
      // TODO: Obter ID do usuário atual (líder/pastor que está rejeitando)
      const approverId = user?.id || ""; // Substituir por ID real do usuário logado

      const result = await rejectEnrollment(
        enrollmentId,
        approverId,
        rejectReason,
      );
      if (result.success) {
        toast.success(result.message);
        setShowRejectModal(false);
        setRejectReason("");
        setCurrentEnrollment(null);
        refetchEnrollments();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao rejeitar matrícula");
    }
  };

  const handleUpdateUserRole = async (
    userId: string,
    role: "MEMBROS" | "ADMIN" | "LIDER",
  ) => {
    try {
      const result = await updateUserRole(userId, role);
      if (result.success) {
        toast.success(result.message);
        refetchStudents();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar função do usuário");
    }
  };

  const handleUpdateUserPastorStatus = async (
    userId: string,
    isPastor: boolean,
  ) => {
    try {
      const result = await updateUserPastorStatus(userId, isPastor);
      if (result.success) {
        toast.success(result.message);
        refetchStudents();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar status de pastor");
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      case "approved":
        return "text-green-400 bg-green-400/20";
      case "rejected":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getEnrollmentStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovada";
      case "rejected":
        return "Rejeitada";
      default:
        return "Desconhecido";
    }
  };

  useEffect(() => {
    if (
      allEnrollmentsData &&
      filteredStudents.length > 0 &&
      !pendingInitialized
    ) {
      const studentsWithPending: Record<string, boolean> = {};
      let firstStudentWithPending: Student | null = null;

      filteredStudents.forEach((student) => {
        const hasPending = allEnrollmentsData.some(
          (enrollment) =>
            enrollment.studentId === student.id &&
            enrollment.status === "pending",
        );

        if (hasPending) {
          studentsWithPending[student.id] = true;
          // Guardar o primeiro aluno com pendência
          if (!firstStudentWithPending) {
            firstStudentWithPending = student;
          }
        }
      });

      // Atualizar showEnrollments e selectedStudent apenas se houver alunos com pendências
      if (Object.keys(studentsWithPending).length > 0) {
        setShowEnrollments((prev) => ({
          ...prev,
          ...studentsWithPending,
        }));

        // Selecionar o primeiro aluno com pendência para carregar suas matrículas
        if (firstStudentWithPending) {
          setSelectedStudent(firstStudentWithPending);
        }

        setPendingInitialized(true);
      }
    }
  }, [allEnrollmentsData, filteredStudents, pendingInitialized]);

  // Função para obter matrículas pendentes de um aluno específico
  const getStudentPendingEnrollments = (studentId: string) => {
    if (!allEnrollmentsData) return [];
    return allEnrollmentsData.filter(
      (enrollment) =>
        enrollment.studentId === studentId && enrollment.status === "pending",
    );
  };

  // Função para alternar visibilidade das matrículas
  const toggleEnrollments = (studentId: string) => {
    setShowEnrollments((prev) => ({
      ...prev,
      [studentId]: !prev[studentId],
    }));

    // Se está abrindo, seleciona o aluno e busca as matrículas
    if (!showEnrollments[studentId]) {
      setSelectedStudent(
        filteredStudents.find((s) => s.id === studentId) || null,
      );
    }
  };

  const getRoleText = (role: string, isPastor: boolean) => {
    const baseRole =
      role === "ADMIN"
        ? "Administrador"
        : role === "LIDER"
          ? "Líder"
          : "Membro";
    return isPastor ? `${baseRole} (Pastor)` : baseRole;
  };

  if (studentsLoading || statsLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={Users}
          title="Carregando alunos..."
          description="Aguarde enquanto carregamos os dados."
        />
      </PageLayout>
    );
  }

  if (studentsError || statsError) {
    return (
      <PageLayout>
        <ErrorState
          icon={Users}
          title="Erro ao carregar dados"
          description="Não foi possível carregar os dados dos alunos."
          onRetry={() => refetchStudents()}
        />
      </PageLayout>
    );
  }

  const totalStudents = statsData?.totalStudents || 0;
  const activeStudents = statsData?.activeStudents || 0;
  const totalCoursesEnrolled = statsData?.totalEnrollments || 0;
  const totalCertificates = statsData?.totalCertificates || 0;

  return (
    <PageLayout spacing="relaxed">
      <PageHeader
        title="Gestão de Alunos 👥"
        description="Gerencie e acompanhe o progresso dos seus alunos"
        actions={[
          {
            label: "Exportar",
            icon: Download,
            className: "dark-glass dark-border hover:dark-border-hover",
          },
          {
            label: "Filtros",
            icon: Filter,
            className: "dark-glass dark-border hover:dark-border-hover",
          },
        ]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Total de Alunos
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {totalStudents}
              </p>
            </div>
            <div className="dark-primary-subtle-bg rounded-xl p-3">
              <Users className="dark-primary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {totalStudents} cadastrados
            </span>
          </div>
        </div>

        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Alunos Ativos
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {activeStudents}
              </p>
            </div>
            <div className="dark-success-bg rounded-xl p-3">
              <TrendingUp className="dark-success" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {Math.round((activeStudents / totalStudents) * 100)}% ativos
            </span>
          </div>
        </div>

        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Total de Inscrições
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {totalCoursesEnrolled}
              </p>
            </div>
            <div className="dark-secondary-subtle-bg rounded-xl p-3">
              <BookOpen className="dark-secondary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {Math.round(totalCoursesEnrolled / totalStudents)} por aluno
            </span>
          </div>
        </div>

        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Certificados Emitidos
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {totalCertificates}
              </p>
            </div>
            <div className="dark-warning-bg rounded-xl p-3">
              <Award className="dark-warning" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {Math.round((totalCertificates / totalCoursesEnrolled) * 100)}%
              taxa
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Section title="Buscar Alunos">
        <div className="relative">
          <Search className="dark-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome, email ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark-input pl-10"
          />
        </div>
      </Section>

      {/* Students List */}
      <Section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
            <Users className="dark-primary" size={24} />
            Lista de Alunos ({filteredStudents.length})
          </h2>
          {filteredStudents.some(
            (student) => getStudentPendingEnrollments(student.id).length > 0,
          ) && (
            <div className="dark-warning-bg flex items-center gap-2 rounded-lg px-3 py-2">
              <Clock className="dark-warning h-4 w-4 animate-pulse" />
              <span className="dark-warning text-sm font-medium">
                {
                  filteredStudents.filter(
                    (student) =>
                      getStudentPendingEnrollments(student.id).length > 0,
                  ).length
                }{" "}
                aluno(s) com matrículas pendentes
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {filteredStudents.length > 0 ? (
            <Accordion type="multiple" className="space-y-4">
              {filteredStudents.map((student) => {
                const hasPendingEnrollments =
                  getStudentPendingEnrollments(student.id).length > 0;
                return (
                  <AccordionItem
                    key={student.id}
                    value={`student-${student.id}`}
                    className={`dark-glass dark-shadow-sm rounded-xl`}
                  >
                    <AccordionTrigger
                      className="dark-card hover:dark-bg-secondary w-full p-4 transition-all"
                      arrow={true}
                    >
                      {/* Mobile Layout */}
                      <div className="flex w-full min-w-0 items-center gap-2 md:hidden">
                        <div className="flex min-w-0 flex-1 items-start gap-3 overflow-hidden pr-2">
                          <div
                            className={`flex-shrink-0 rounded-xl p-2 ${
                              hasPendingEnrollments
                                ? "dark-warning-bg"
                                : "dark-primary-subtle-bg"
                            }`}
                          >
                            {hasPendingEnrollments ? (
                              <Clock
                                className="dark-warning animate-pulse"
                                size={20}
                              />
                            ) : (
                              <Users className="dark-primary" size={20} />
                            )}
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                            <div className="flex min-w-0 items-center justify-between gap-2">
                              <h3 className="dark-text-primary truncate font-semibold">
                                {student.name}
                              </h3>
                              {hasPendingEnrollments && (
                                <div className="dark-warning-bg flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5">
                                  <Clock className="dark-warning h-3 w-3 animate-pulse" />
                                  <span className="dark-warning text-xs font-medium whitespace-nowrap">
                                    {
                                      getStudentPendingEnrollments(student.id)
                                        .length
                                    }{" "}
                                    pendente
                                    {getStudentPendingEnrollments(student.id)
                                      .length !== 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>
                              )}
                              <span
                                className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(student.approvalStatus)}`}
                              >
                                {getStatusText(student.approvalStatus)}
                              </span>
                            </div>
                            <p className="dark-text-secondary truncate text-sm">
                              {student.email}
                            </p>
                            <span className="dark-text-tertiary text-xs">
                              {getRoleText(student.role, student.isPastor)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden w-full items-center justify-between md:flex">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-xl p-2 ${
                              hasPendingEnrollments
                                ? "dark-warning-bg"
                                : "dark-primary-subtle-bg"
                            }`}
                          >
                            {hasPendingEnrollments ? (
                              <Clock
                                className="dark-warning animate-pulse"
                                size={20}
                              />
                            ) : (
                              <Users className="dark-primary" size={20} />
                            )}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="dark-text-primary font-semibold">
                                {student.name}
                              </h3>
                              {hasPendingEnrollments && (
                                <div className="dark-warning-bg flex items-center gap-1 rounded-full px-2 py-0.5">
                                  <Clock className="dark-warning h-3 w-3 animate-pulse" />
                                  <span className="dark-warning text-xs font-medium">
                                    {
                                      getStudentPendingEnrollments(student.id)
                                        .length
                                    }{" "}
                                    matrícula(s) pendente(s)
                                    {getStudentPendingEnrollments(student.id)
                                      .length !== 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="dark-text-secondary text-sm">
                              {student.email}
                            </p>
                            <div className="mt-1 flex items-center gap-4">
                              <span className="dark-text-tertiary text-xs">
                                Função:{" "}
                                {getRoleText(student.role, student.isPastor)}
                              </span>
                              <span className="dark-text-tertiary text-xs">
                                Status: {getStatusText(student.approvalStatus)}
                              </span>
                              <span className="dark-text-tertiary text-xs">
                                Membro desde {formatDate(student.joinDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(student.approvalStatus)}`}
                          >
                            {getStatusText(student.approvalStatus)}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="dark-border">
                      <div className="space-y-6 p-6">
                        {/* Informações Básicas */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <h4 className="dark-text-primary font-semibold">
                              Informações Pessoais
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm">
                                <Mail className="dark-text-tertiary mr-2 h-3 w-3" />
                                <span className="dark-text-secondary">
                                  {student.email}
                                </span>
                              </div>
                              {student.phone && (
                                <div className="flex items-center text-sm">
                                  <Phone className="dark-text-tertiary mr-2 h-3 w-3" />
                                  <span className="dark-text-secondary">
                                    {student.phone}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center text-sm">
                                <Calendar className="dark-text-tertiary mr-2 h-3 w-3" />
                                <span className="dark-text-secondary">
                                  CPF: {student.cpf}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="dark-text-primary font-semibold">
                              Estatísticas
                            </h4>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="dark-text-secondary">
                                  Progresso do Perfil
                                </span>
                                <span className="dark-text-primary font-semibold">
                                  {student.profileCompletion}%
                                </span>
                              </div>
                              <div className="dark-bg-tertiary h-2 w-full rounded-full">
                                <div
                                  className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${student.profileCompletion}%`,
                                  }}
                                />
                              </div>
                              <div className="dark-text-secondary text-sm">
                                <BookOpen className="mr-1 inline h-3 w-3" />
                                Cursos Inscritos: {student.coursesEnrolled}
                              </div>
                              <div className="dark-text-secondary text-sm">
                                <Award className="mr-1 inline h-3 w-3" />
                                Cursos Completados: {student.coursesCompleted}
                              </div>
                              <div className="dark-text-secondary text-sm">
                                <Award className="mr-1 inline h-3 w-3" />
                                Certificados: {student.certificatesEarned}
                              </div>
                              <div className="dark-text-secondary text-sm">
                                Última atividade:{" "}
                                {getTimeAgo(student.lastActivity)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Gerenciamento de Função */}
                        <div className="space-y-3">
                          <h4 className="dark-text-primary font-semibold">
                            Gerenciar Função
                          </h4>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <span className="dark-text-secondary text-sm">
                                Função atual:
                              </span>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  student.role === "ADMIN"
                                    ? "bg-blue-400/20 text-blue-400"
                                    : student.role === "LIDER"
                                      ? "bg-purple-400/20 text-purple-400"
                                      : "bg-gray-400/20 text-gray-400"
                                }`}
                              >
                                {getRoleText(student.role, student.isPastor)}
                              </span>
                              <Select
                                value={student.role}
                                onValueChange={(
                                  value: "MEMBROS" | "ADMIN" | "LIDER",
                                ) => handleUpdateUserRole(student.id, value)}
                              >
                                <SelectTrigger className="dark-input w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MEMBROS">
                                    Membro
                                  </SelectItem>
                                  <SelectItem value="ADMIN">
                                    Administrador
                                  </SelectItem>
                                  <SelectItem value="LIDER">Líder</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="dark-text-secondary text-sm">
                                Status de Pastor:
                              </span>
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  student.isPastor
                                    ? "bg-purple-400/20 text-purple-400"
                                    : "bg-gray-400/20 text-gray-400"
                                }`}
                              >
                                {student.isPastor ? "Pastor" : "Não é Pastor"}
                              </span>
                              <Button
                                size="sm"
                                className={
                                  student.isPastor
                                    ? "dark-glass dark-border hover:dark-border-hover"
                                    : "dark-btn-primary"
                                }
                                onClick={() =>
                                  handleUpdateUserPastorStatus(
                                    student.id,
                                    !student.isPastor,
                                  )
                                }
                              >
                                {student.isPastor
                                  ? "Remover Pastor"
                                  : "Tornar Pastor"}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Matrículas Pendentes */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h4 className="dark-text-primary font-semibold">
                                Matrículas em Cursos
                              </h4>
                              {student.coursesEnrolled > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="dark-bg-secondary dark-border dark-text-secondary rounded-full px-2 py-1 text-xs">
                                    {student.coursesEnrolled} curso
                                    {student.coursesEnrolled !== 1 ? "s" : ""}
                                  </div>
                                  {student.coursesEnrolled > 0 && (
                                    <div className="flex items-center gap-1">
                                      <div className="dark-bg-primary h-2 w-2 animate-pulse rounded-full"></div>
                                      <span className="dark-text-tertiary text-xs">
                                        Ativo
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              {getStudentPendingEnrollments(student.id).length >
                                0 && (
                                <div className="dark-warning-bg flex items-center gap-1 rounded-full px-2 py-1">
                                  <Clock className="dark-warning h-3 w-3 animate-pulse" />
                                  <span className="dark-warning text-xs font-medium">
                                    {
                                      getStudentPendingEnrollments(student.id)
                                        .length
                                    }{" "}
                                    pendente
                                    {getStudentPendingEnrollments(student.id)
                                      .length !== 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>
                              )}
                            </div>
                            <Button
                              size="sm"
                              className="dark-btn-primary"
                              onClick={() => toggleEnrollments(student.id)}
                            >
                              <Eye className="mr-2 h-3 w-3" />
                              {showEnrollments[student.id]
                                ? "Ocultar Matrículas"
                                : "Ver Matrículas"}
                            </Button>
                          </div>

                          {showEnrollments[student.id] && (
                            <div className="space-y-3">
                              {enrollmentsLoading ? (
                                <div className="dark-card dark-shadow-sm rounded-lg p-6">
                                  <div className="flex items-center justify-center gap-3">
                                    <Loader2 className="dark-text-primary h-5 w-5 animate-spin" />
                                    <div className="dark-text-secondary">
                                      Carregando matrículas...
                                    </div>
                                  </div>
                                  <div className="mt-4 space-y-3">
                                    {[1, 2, 3].map((i) => (
                                      <div key={i} className="animate-pulse">
                                        <div className="dark-bg-tertiary h-16 rounded-lg"></div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : enrollmentsData &&
                                enrollmentsData.length > 0 ? (
                                <div className="space-y-4">
                                  {enrollmentsData.map((enrollment) => (
                                    <div
                                      key={enrollment.id}
                                      className={`dark-card dark-shadow-sm hover:dark-shadow-md rounded-lg p-5 transition-all duration-300 ${
                                        enrollment.status === "pending"
                                          ? "border-l-warning from-warning/5 border-l-4 bg-gradient-to-r to-transparent"
                                          : ""
                                      }`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1 space-y-3">
                                          <div className="flex items-center gap-3">
                                            <div className="dark-bg-tertiary rounded-lg p-2">
                                              <BookOpen className="dark-text-primary h-4 w-4" />
                                            </div>
                                            <div>
                                              <h5 className="dark-text-primary text-lg font-semibold">
                                                {enrollment.course.title}
                                              </h5>
                                              <p className="dark-text-secondary text-sm">
                                                Instrutor:{" "}
                                                <span className="dark-text-primary font-medium">
                                                  {addPastorPrefix(
                                                    enrollment.course.instructor
                                                      ?.name,
                                                    enrollment.course.instructor
                                                      ?.isPastor,
                                                  ) || "Não informado"}
                                                </span>
                                              </p>
                                            </div>
                                          </div>

                                          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                                            <div className="flex items-center gap-2">
                                              <Calendar className="dark-text-tertiary h-4 w-4" />
                                              <span className="dark-text-tertiary">
                                                Solicitado em:{" "}
                                                <span className="dark-text-secondary font-medium">
                                                  {formatDate(
                                                    enrollment.enrolledAt,
                                                  )}
                                                </span>
                                              </span>
                                            </div>

                                            {enrollment.approvedAt && (
                                              <div className="flex items-center gap-2">
                                                <CheckCircle className="dark-success h-4 w-4" />
                                                <span className="dark-text-tertiary">
                                                  Aprovado em:{" "}
                                                  <span className="dark-text-secondary font-medium">
                                                    {formatDate(
                                                      enrollment.approvedAt,
                                                    )}
                                                  </span>
                                                  {enrollment.approver &&
                                                    ` por ${enrollment.approver.name}`}
                                                </span>
                                              </div>
                                            )}

                                            {enrollment.rejectionReason && (
                                              <div className="flex items-center gap-2 md:col-span-2">
                                                <AlertCircle className="dark-error h-4 w-4" />
                                                <span className="dark-text-tertiary">
                                                  Motivo da rejeição:{" "}
                                                  <span className="dark-text-secondary font-medium">
                                                    {enrollment.rejectionReason}
                                                  </span>
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${getEnrollmentStatusColor(enrollment.status)}`}
                                            >
                                              {enrollment.status ===
                                                "pending" && (
                                                <Clock className="h-3 w-3 animate-pulse" />
                                              )}
                                              {enrollment.status ===
                                                "approved" && (
                                                <CheckCircle className="h-3 w-3" />
                                              )}
                                              {enrollment.status ===
                                                "rejected" && (
                                                <XCircle className="h-3 w-3" />
                                              )}
                                              {getEnrollmentStatusText(
                                                enrollment.status,
                                              )}
                                            </span>
                                          </div>

                                          {enrollment.status === "pending" && (
                                            <div className="flex gap-2">
                                              <Button
                                                size="sm"
                                                className="dark-success-bg dark-success hover:dark-success-bg transition-all duration-200 hover:scale-105"
                                                onClick={() =>
                                                  handleApproveEnrollment(
                                                    enrollment.id,
                                                  )
                                                }
                                              >
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Aprovar
                                              </Button>
                                              <Button
                                                size="sm"
                                                className="dark-error-bg dark-error hover:dark-error-bg transition-all duration-200 hover:scale-105"
                                                onClick={() => {
                                                  setCurrentEnrollment(
                                                    enrollment,
                                                  );
                                                  setShowRejectModal(true);
                                                }}
                                              >
                                                <XCircle className="mr-1 h-3 w-3" />
                                                Rejeitar
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {enrollment.status === "pending" && (
                                        <div className="dark-bg-tertiary border-l-warning mt-4 rounded-lg border-l-4 p-3">
                                          <div className="flex items-center gap-2">
                                            <AlertCircle className="dark-warning h-4 w-4" />
                                            <span className="dark-text-secondary text-sm font-medium">
                                              Esta matrícula está aguardando
                                              aprovação
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <EmptyState
                                  icon={BookOpen}
                                  title="Nenhuma matrícula encontrada"
                                  description="Este aluno ainda não possui matrículas em cursos"
                                  variant="compact"
                                />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Ações */}
                        <div className="dark-border flex justify-end gap-2 border-t pt-4">
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                              handleGenerateAccessLink(student.id, student.name)
                            }
                            disabled={generatingLinkFor === student.id}
                          >
                            {generatingLinkFor === student.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Gerando...
                              </>
                            ) : (
                              <>
                                <Link2 className="h-4 w-4" />
                                Gerar Link
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            className="dark-glass dark-border hover:dark-border-hover"
                            onClick={() => {
                              const newStatus =
                                student.approvalStatus === "APPROVED"
                                  ? "REJECTED"
                                  : "APPROVED";
                              handleUpdateStudentStatus(student.id, newStatus);
                            }}
                          >
                            {student.approvalStatus === "APPROVED"
                              ? "Desativar"
                              : "Ativar"}
                          </Button>
                          <Button
                            size="sm"
                            className="dark-error-bg dark-error hover:dark-error-bg"
                            onClick={() =>
                              handleDeleteStudent(student.id, student.name)
                            }
                          >
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <EmptyState
              icon={Users}
              title="Nenhum aluno encontrado"
              description="Não há alunos cadastrados no sistema ainda"
            />
          )}
        </div>
      </Section>

      {/* Modal de Rejeição de Matrícula */}
      {showRejectModal && currentEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="dark-glass dark-shadow-md mx-4 w-full max-w-md rounded-xl p-6">
            <h3 className="dark-text-primary mb-4 text-lg font-semibold">
              Rejeitar Matrícula
            </h3>
            <p className="dark-text-secondary mb-4 text-sm">
              Informe o motivo da rejeição da matrícula no curso "
              {currentEnrollment.course.title}":
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Digite o motivo da rejeição..."
              className="dark-input mb-4 min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                className="dark-glass dark-border hover:dark-border-hover"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setCurrentEnrollment(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="dark-error-bg dark-error hover:dark-error-bg"
                onClick={() => handleRejectEnrollment(currentEnrollment.id)}
              >
                Rejeitar Matrícula
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
