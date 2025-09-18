"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
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
import { useEffect, useState } from "react";

interface Certificate {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  courseId: string;
  issuedAt: Date;
  completedAt: Date;
  grade: number;
  certificateUrl: string;
  status: "issued" | "pending" | "revoked";
  verificationCode: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<
    Certificate[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados dos certificados
    setTimeout(() => {
      const mockCertificates: Certificate[] = [
        {
          id: "1",
          studentName: "Maria Silva",
          studentEmail: "maria.silva@basechurch.com",
          courseName: "Fundamentos da Fé Cristã",
          courseId: "1",
          issuedAt: new Date("2024-03-15"),
          completedAt: new Date("2024-03-14"),
          grade: 95,
          certificateUrl: "/certificates/1.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-001",
        },
        {
          id: "2",
          studentName: "João Santos",
          studentEmail: "joao.santos@basechurch.com",
          courseName: "Liderança Ministerial",
          courseId: "2",
          issuedAt: new Date("2024-04-20"),
          completedAt: new Date("2024-04-19"),
          grade: 98,
          certificateUrl: "/certificates/2.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-002",
        },
        {
          id: "3",
          studentName: "Ana Costa",
          studentEmail: "ana.costa@basechurch.com",
          courseName: "Discipulado e Evangelismo",
          courseId: "3",
          issuedAt: new Date("2024-05-10"),
          completedAt: new Date("2024-05-09"),
          grade: 92,
          certificateUrl: "/certificates/3.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-003",
        },
        {
          id: "4",
          studentName: "Carlos Oliveira",
          studentEmail: "carlos.oliveira@basechurch.com",
          courseName: "Interpretação Bíblica",
          courseId: "4",
          issuedAt: new Date("2024-04-25"),
          completedAt: new Date("2024-04-24"),
          grade: 89,
          certificateUrl: "/certificates/4.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-004",
        },
        {
          id: "5",
          studentName: "Fernanda Lima",
          studentEmail: "fernanda.lima@basechurch.com",
          courseName: "Aconselhamento Pastoral",
          courseId: "5",
          issuedAt: new Date("2024-03-15"),
          completedAt: new Date("2024-03-14"),
          grade: 96,
          certificateUrl: "/certificates/5.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-005",
        },
        {
          id: "6",
          studentName: "Roberto Alves",
          studentEmail: "roberto.alves@basechurch.com",
          courseName: "História da Igreja",
          courseId: "6",
          issuedAt: new Date("2024-02-28"),
          completedAt: new Date("2024-02-27"),
          grade: 87,
          certificateUrl: "/certificates/6.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-006",
        },
        {
          id: "7",
          studentName: "Patricia Souza",
          studentEmail: "patricia.souza@basechurch.com",
          courseName: "Fundamentos da Fé Cristã",
          courseId: "1",
          issuedAt: new Date("2024-05-20"),
          completedAt: new Date("2024-05-19"),
          grade: 91,
          certificateUrl: "/certificates/7.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-007",
        },
        {
          id: "8",
          studentName: "Marcos Ferreira",
          studentEmail: "marcos.ferreira@basechurch.com",
          courseName: "Liderança Ministerial",
          courseId: "2",
          issuedAt: new Date("2024-05-15"),
          completedAt: new Date("2024-05-14"),
          grade: 94,
          certificateUrl: "/certificates/8.pdf",
          status: "issued",
          verificationCode: "BC-CERT-2024-008",
        },
      ];

      setCertificates(mockCertificates);
      setFilteredCertificates(mockCertificates);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = certificates.filter(
      (certificate) =>
        certificate.studentName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        certificate.studentEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        certificate.courseName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        certificate.verificationCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
    setFilteredCertificates(filtered);
  }, [searchTerm, certificates]);

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

  const totalCertificates = certificates.length;
  const issuedCertificates = certificates.filter(
    (c) => c.status === "issued",
  ).length;
  const pendingCertificates = certificates.filter(
    (c) => c.status === "pending",
  ).length;
  const averageGrade =
    certificates
      .filter((c) => c.grade > 0)
      .reduce((sum, c) => sum + c.grade, 0) /
      certificates.filter((c) => c.grade > 0).length || 0;

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
                                Concluído em{" "}
                                {formatDate(certificate.completedAt)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="dark-text-tertiary mr-2 h-3 w-3" />
                              <span className="dark-text-secondary">
                                Emitido em {formatDate(certificate.issuedAt)}
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
                            Última atualização:{" "}
                            {getTimeAgo(certificate.issuedAt)}
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
