"use client";

import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Plus,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PdfViewer } from "../../../../components/pdf-viewer";
import {
  deleteCertificateTemplate,
  getAllCertificateTemplates,
} from "../../../../lib/actions/certificate";

interface CertificateTemplate {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  templateUrl: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  course: {
    id: string;
    title: string;
    description: string;
    instructor: {
      id: string;
      name: string | null;
    };
  };
  // Campos adicionais para compatibilidade com a UI
  courseName: string;
  instructorName: string;
  certificateCount: number; // Número de certificados emitidos baseados neste template
}

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch certificate templates
  const {
    data: templatesData,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery({
    queryKey: ["certificate-templates"],
    queryFn: getAllCertificateTemplates,
    select: (data) => data.templates,
  });

  const isLoading = templatesLoading;
  const error = templatesError;

  // Delete certificate template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: deleteCertificateTemplate,
    onSuccess: () => {
      toast.success("Template de certificado excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["certificate-templates"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao excluir template de certificado");
    },
  });

  const handleDeleteTemplate = (templateId: string) => {
    if (
      confirm("Tem certeza que deseja excluir este template de certificado?")
    ) {
      deleteTemplateMutation.mutate(templateId);
    }
  };

  // Transform templates data to match UI expectations
  const templates: CertificateTemplate[] =
    templatesData?.map((template: any) => ({
      id: template.id,
      courseId: template.courseId,
      title: template.title,
      description: template.description,
      templateUrl: template.templateUrl,
      isActive: template.isActive,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      course: {
        id: template.course.id,
        title: template.course.title,
        description: template.course.description || "",
        instructor: {
          id: template.course.instructor?.id || "",
          name: template.course.instructor?.name || null,
        },
      },
      // Campos adicionais para compatibilidade com a UI
      courseName: template.course.title,
      instructorName:
        template.course.instructor?.name || "Instrutor não informado",
      certificateCount: template.certificates?.length || 0, // Número de certificados baseados neste template
    })) || [];

  // Filter templates based on search term
  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.instructorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (template.description &&
        template.description.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Log para debug
  console.log("🏆 Certificate Templates Debug:", {
    templatesData,
    templates,
    templatesError,
  });

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "text-green-400 bg-green-400/20"
      : "text-red-400 bg-red-400/20";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "Ativo" : "Inativo";
  };

  const getCertificateCountColor = (count: number) => {
    if (count === 0) return "text-gray-400";
    if (count < 5) return "text-yellow-400";
    return "text-green-400";
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
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoje";
    if (days === 1) return "Ontem";
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    return `${Math.floor(days / 30)} meses atrás`;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={Award}
          title="Carregando templates de certificados..."
          description="Aguarde enquanto carregamos os dados."
        />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <ErrorState
          icon={Award}
          title="Erro ao carregar templates de certificados"
          description={error?.message || "Tente novamente mais tarde."}
          retryLabel="Recarregar"
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  // Calculate stats from templates data
  const totalTemplates = templates.length;
  const activeTemplates = templates.filter((t) => t.isActive).length;
  const totalCertificatesIssued = templates.reduce(
    (sum, t) => sum + t.certificateCount,
    0,
  );
  const averageCertificatesPerTemplate =
    totalTemplates > 0 ? totalCertificatesIssued / totalTemplates : 0;

  return (
    <PageLayout spacing="relaxed">
      <PageHeader
        title="Templates de Certificados 🏆"
        description="Gerencie e acompanhe os templates de certificados dos cursos"
        actions={[
          {
            label: "Exportar Relatório",
            icon: Download,
            className: "dark-glass dark-border hover:dark-border-hover",
          },
          {
            label: "Criar Template",
            icon: Plus,
            variant: "success",
            onClick: () => router.push("/dashboard/courses"),
          },
        ]}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Total de Templates
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {totalTemplates}
              </p>
            </div>
            <div className="dark-primary-subtle-bg rounded-xl p-3">
              <Award className="dark-primary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {totalTemplates} templates criados
            </span>
          </div>
        </div>

        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Templates Ativos
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {activeTemplates}
              </p>
            </div>
            <div className="dark-success-bg rounded-xl p-3">
              <CheckCircle className="dark-success" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {totalTemplates > 0
                ? Math.round((activeTemplates / totalTemplates) * 100)
                : 0}
              % ativos
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
                {totalCertificatesIssued}
              </p>
            </div>
            <div className="dark-warning-bg rounded-xl p-3">
              <Clock className="dark-warning" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              {totalCertificatesIssued} certificados emitidos
            </span>
          </div>
        </div>

        <div className="dark-card dark-shadow-sm rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="dark-text-tertiary text-sm font-medium">
                Média por Template
              </p>
              <p className="dark-text-primary text-2xl font-bold">
                {averageCertificatesPerTemplate.toFixed(1)}
              </p>
            </div>
            <div className="dark-secondary-subtle-bg rounded-xl p-3">
              <TrendingUp className="dark-secondary" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="dark-success mr-1" size={16} />
            <span className="dark-success font-medium">
              certificados por template
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h2 className="dark-text-primary mb-4 flex items-center gap-2 text-xl font-bold">
          <Search className="dark-primary" size={24} />
          Buscar Templates
        </h2>
        <div className="relative">
          <Search className="dark-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar por título, curso ou instrutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="dark-input pl-10"
          />
        </div>
      </div>

      {/* Templates List */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
          <Award className="dark-primary" size={24} />
          Lista de Templates ({filteredTemplates.length})
        </h2>

        <div className="space-y-4">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="dark-card dark-shadow-sm rounded-xl p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="dark-primary-subtle-bg flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                    <Award className="dark-primary" size={20} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="dark-text-primary font-semibold">
                          {template.title}
                        </h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm">
                            <BookOpen className="dark-text-tertiary mr-2 h-3 w-3" />
                            <span className="dark-text-secondary">
                              {template.courseName}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Edit className="dark-text-tertiary mr-2 h-3 w-3" />
                            <span className="dark-text-secondary">
                              Instrutor: {template.instructorName}
                            </span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Calendar className="dark-text-tertiary mr-2 h-3 w-3" />
                            <span className="dark-text-secondary">
                              Criado em {formatDate(template.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(template.isActive)}`}
                        >
                          {getStatusText(template.isActive)}
                        </span>
                        <div className="flex space-x-2">
                          {template.templateUrl && (
                            <PdfViewer
                              pdfBase64={template.templateUrl}
                              certificateUrl={template.templateUrl}
                              title={`Template: ${template.title}`}
                              fileName={`template-${template.id}.pdf`}
                            />
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(
                                `/dashboard/courses/${template.courseId}/edit`,
                              )
                            }
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTemplate(template.id)}
                            disabled={deleteTemplateMutation.isPending}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <div className="dark-text-secondary text-sm">
                          {template.description || "Sem descrição"}
                        </div>
                        <div className="dark-text-secondary text-sm">
                          Curso ID: {template.courseId}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div
                          className={`font-semibold ${getCertificateCountColor(template.certificateCount)}`}
                        >
                          Certificados: {template.certificateCount}
                        </div>
                        <div className="dark-text-secondary text-sm">
                          Status: {getStatusText(template.isActive)}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="dark-text-secondary text-sm">
                          Criado: {getTimeAgo(template.createdAt)}
                        </div>
                        <div className="dark-text-secondary text-sm">
                          Atualizado: {getTimeAgo(template.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
              <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Award className="dark-text-tertiary" size={24} />
              </div>
              <h3 className="dark-text-primary mb-2 font-semibold">
                Nenhum template criado
              </h3>
              <p className="dark-text-tertiary mb-4 text-sm">
                Não há templates de certificados criados ainda
              </p>
              <Button
                onClick={() => router.push("/dashboard/courses")}
                variant="success"
              >
                <Plus className="mr-2 h-4 w-4" />
                Criar Template
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
