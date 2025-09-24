"use client";

import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import {
    Award,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    Search,
    TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
    getAllCertificates,
    getCertificateStats,
} from "../../../../lib/actions";

interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date | null;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  course: {
    id: string;
    title: string;
  };
  // Campos adicionais para compatibilidade com a UI
  studentName: string;
  studentEmail: string;
  courseName: string;
  grade: number;
  certificateUrl: string;
  status: "issued" | "pending" | "revoked";
  verificationCode: string;
}

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch certificates
  const {
    data: certificatesData,
    isLoading: certificatesLoading,
    error: certificatesError,
  } = useQuery({
    queryKey: ["certificates"],
    queryFn: getAllCertificates,
    select: (data) => data.certificates,
  });

  // Fetch certificate stats
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["certificate-stats"],
    queryFn: getCertificateStats,
    select: (data) => data.stats,
  });

  const isLoading = certificatesLoading || statsLoading;
  const error = certificatesError || statsError;

  // Transform certificates data to match UI expectations
  const certificates: Certificate[] =
    certificatesData?.map((cert) => ({
      id: cert.id,
      userId: cert.userId,
      courseId: cert.courseId,
      issuedAt: cert.issuedAt,
      createdAt: cert.issuedAt, // Usar issuedAt como createdAt já que não existe campo createdAt
      user: cert.user,
      course: cert.course,
      // Campos adicionais para compatibilidade com a UI
      studentName: cert.user.name || "Nome não informado",
      studentEmail: cert.user.email || "Email não informado",
      courseName: cert.course.title,
      grade: Math.floor(Math.random() * 20) + 80, // Mock grade between 80-100
      certificateUrl: cert.certificateUrl || `/certificates/${cert.id}.pdf`,
      status: (cert.issuedAt ? "issued" : "pending") as
        | "issued"
        | "pending"
        | "revoked",
      verificationCode: `BC-CERT-${cert.id.slice(0, 8).toUpperCase()}`,
    })) || [];

  // Filter certificates based on search term
  const filteredCertificates = certificates.filter(
    (certificate) =>
      certificate.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      certificate.studentEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      certificate.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      certificate.verificationCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  // Log para debug
  console.log("🏆 Certificates Debug:", {
    certificatesData,
    statsData,
    certificates,
    certificatesError,
    statsError,
  });

  const getStatusColor = (status: Certificate["status"]) => {
    switch (status) {
      case "issued":
        return "text-green-400 bg-green-400/20";
      case "pending":
        return "text-yellow-400 bg-yellow-400/20";
      case "revoked":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusText = (status: Certificate["status"]) => {
    switch (status) {
      case "issued":
        return "Emitido";
      case "pending":
        return "Pendente";
      case "revoked":
        return "Revogado";
      default:
        return "Desconhecido";
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-400";
    if (grade >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Não emitido";
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Não emitido";
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
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="dark-text-primary mb-4 text-xl font-semibold">
              Carregando certificados...
            </div>
            <div className="dark-text-secondary">
              Aguarde enquanto carregamos os dados.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="dark-text-primary mb-4 text-xl font-semibold">
              Erro ao carregar certificados
            </div>
            <div className="dark-text-secondary mb-4">
              {error?.message || "Tente novamente mais tarde."}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="dark-primary-bg dark-primary-text hover:dark-primary-bg-hover rounded-lg px-4 py-2 font-medium transition-colors"
            >
              Recarregar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalCertificates = statsData?.totalCertificates || 0;
  const issuedCertificates = statsData?.issuedCertificates || 0;
  const pendingCertificates = statsData?.pendingCertificates || 0;
  const averageGrade = statsData?.averageGrade || 0;

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Gestão de Certificados 🏆
              </h1>
              <p className="dark-text-secondary">
                Gerencie e acompanhe os certificados emitidos
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="dark-glass dark-border hover:dark-border-hover">
                <Download className="mr-2 h-4 w-4" />
                Exportar Relatório
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Section */}
        {certificatesData && (
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <h2 className="dark-text-primary mb-4 text-xl font-bold">
              🧪 Debug - Dados do Banco
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="dark-bg-secondary rounded-lg p-4">
                <p className="dark-text-tertiary text-sm">
                  Total de Certificados
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {certificatesData.length}
                </p>
              </div>
              <div className="dark-bg-secondary rounded-lg p-4">
                <p className="dark-text-tertiary text-sm">
                  Certificados Emitidos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {certificatesData.filter((c) => c.issuedAt).length}
                </p>
              </div>
              <div className="dark-bg-secondary rounded-lg p-4">
                <p className="dark-text-tertiary text-sm">
                  Certificados Pendentes
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {certificatesData.filter((c) => !c.issuedAt).length}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Certificados
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalCertificates}
                </p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <Award className="dark-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {totalCertificates} certificados
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
                  {issuedCertificates}
                </p>
              </div>
              <div className="dark-success-bg rounded-xl p-3">
                <CheckCircle className="dark-success" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {Math.round((issuedCertificates / totalCertificates) * 100)}%
                emitidos
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Pendentes
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {pendingCertificates}
                </p>
              </div>
              <div className="dark-warning-bg rounded-xl p-3">
                <Clock className="dark-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {pendingCertificates} aguardando
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Nota Média
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {averageGrade.toFixed(1)}
                </p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <TrendingUp className="dark-secondary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                Excelente desempenho
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-4 flex items-center gap-2 text-xl font-bold">
            <Search className="dark-primary" size={24} />
            Buscar Certificados
          </h2>
          <div className="relative">
            <Search className="dark-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por aluno, curso ou código de verificação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark-input pl-10"
            />
          </div>
        </div>

        {/* Certificates List */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
            <Award className="dark-primary" size={24} />
            Lista de Certificados ({filteredCertificates.length})
          </h2>

          <div className="space-y-4">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((certificate) => (
                <div
                  key={certificate.id}
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
                            {certificate.studentName}
                          </h3>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center text-sm">
                              <BookOpen className="dark-text-tertiary mr-2 h-3 w-3" />
                              <span className="dark-text-secondary">
                                {certificate.courseName}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="dark-text-tertiary mr-2 h-3 w-3" />
                              <span className="dark-text-secondary">
                                Criado em {formatDate(certificate.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="dark-text-tertiary mr-2 h-3 w-3" />
                              <span className="dark-text-secondary">
                                {certificate.issuedAt
                                  ? `Emitido em ${formatDate(certificate.issuedAt)}`
                                  : "Aguardando emissão"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(certificate.status)}`}
                          >
                            {getStatusText(certificate.status)}
                          </span>
                          <div className="flex space-x-2">
                            {certificate.status === "issued" &&
                              certificate.certificateUrl && (
                                <Button
                                  size="sm"
                                  className="dark-glass dark-border hover:dark-border-hover"
                                  onClick={() =>
                                    window.open(
                                      certificate.certificateUrl,
                                      "_blank",
                                    )
                                  }
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              )}
                            <Button
                              size="sm"
                              className="dark-glass dark-border hover:dark-border-hover"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-1">
                          <div className="dark-text-secondary text-sm">
                            Email: {certificate.studentEmail}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            Código: {certificate.verificationCode}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div
                            className={`font-semibold ${getGradeColor(certificate.grade)}`}
                          >
                            Nota:{" "}
                            {certificate.grade > 0
                              ? `${certificate.grade}%`
                              : "N/A"}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            Status: {getStatusText(certificate.status)}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="dark-text-secondary text-sm">
                            {certificate.issuedAt
                              ? `Emitido: ${getTimeAgo(certificate.issuedAt)}`
                              : `Criado: ${getTimeAgo(certificate.createdAt)}`}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            Curso ID: {certificate.courseId}
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
                  Nenhum certificado emitido
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  Não há certificados emitidos ainda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
