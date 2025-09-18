"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  Eye,
  Filter,
  Mail,
  Phone,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  joinDate: Date;
  role: "MEMBROS" | "LIDER";
  profileCompletion: number;
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  lastActivity: Date;
  status: "active" | "inactive" | "suspended";
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados dos alunos
    // TODO: Implementar busca real dos dados
    setTimeout(() => {
      const mockStudents: Student[] = [
        {
          id: "1",
          name: "Maria Silva",
          email: "maria.silva@basechurch.com",
          phone: "(11) 99999-9999",
          cpf: "123.456.789-00",
          joinDate: new Date("2024-01-15"),
          role: "MEMBROS",
          profileCompletion: 95,
          coursesEnrolled: 6,
          coursesCompleted: 4,
          certificatesEarned: 4,
          lastActivity: new Date(Date.now() - 1000 * 60 * 30),
          status: "active",
        },
        {
          id: "2",
          name: "João Santos",
          email: "joao.santos@basechurch.com",
          phone: "(11) 88888-8888",
          cpf: "987.654.321-00",
          joinDate: new Date("2024-02-20"),
          role: "MEMBROS",
          profileCompletion: 88,
          coursesEnrolled: 8,
          coursesCompleted: 6,
          certificatesEarned: 6,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
          status: "active",
        },
        {
          id: "3",
          name: "Ana Costa",
          email: "ana.costa@basechurch.com",
          cpf: "456.789.123-00",
          joinDate: new Date("2024-03-10"),
          role: "MEMBROS",
          profileCompletion: 65,
          coursesEnrolled: 3,
          coursesCompleted: 1,
          certificatesEarned: 1,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          status: "active",
        },
        {
          id: "4",
          name: "Carlos Oliveira",
          email: "carlos.oliveira@basechurch.com",
          phone: "(11) 77777-7777",
          cpf: "789.123.456-00",
          joinDate: new Date("2024-01-05"),
          role: "MEMBROS",
          profileCompletion: 100,
          coursesEnrolled: 12,
          coursesCompleted: 10,
          certificatesEarned: 10,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 6),
          status: "active",
        },
        {
          id: "5",
          name: "Fernanda Lima",
          email: "fernanda.lima@basechurch.com",
          cpf: "321.654.987-00",
          joinDate: new Date("2024-04-12"),
          role: "MEMBROS",
          profileCompletion: 40,
          coursesEnrolled: 2,
          coursesCompleted: 0,
          certificatesEarned: 0,
          lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
          status: "inactive",
        },
      ];

      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.cpf.includes(searchTerm),
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const getStatusColor = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "text-green-400 bg-green-400/20";
      case "inactive":
        return "text-yellow-400 bg-yellow-400/20";
      case "suspended":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getStatusText = (status: Student["status"]) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "inactive":
        return "Inativo";
      case "suspended":
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

  if (isLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="dark-text-primary mb-4 text-xl font-semibold">
              Carregando alunos...
            </div>
            <div className="dark-text-secondary">
              Aguarde enquanto carregamos os dados.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const totalCoursesEnrolled = students.reduce(
    (sum, s) => sum + s.coursesEnrolled,
    0,
  );
  const totalCertificates = students.reduce(
    (sum, s) => sum + s.certificatesEarned,
    0,
  );

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
                Gestão de Alunos 👥
              </h1>
              <p className="dark-text-secondary">
                Gerencie e acompanhe o progresso dos seus alunos
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="dark-glass dark-border hover:dark-border-hover">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
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
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-4 flex items-center gap-2 text-xl font-bold">
            <Search className="dark-primary" size={24} />
            Buscar Alunos
          </h2>
          <div className="relative">
            <Search className="dark-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por nome, email ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark-input pl-10"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
            <Users className="dark-primary" size={24} />
            Lista de Alunos ({filteredStudents.length})
          </h2>

          <div className="space-y-4">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="dark-card dark-shadow-sm rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="dark-primary-subtle-bg flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                      <Users className="dark-primary" size={20} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="dark-text-primary font-semibold">
                            {student.name}
                          </h3>
                          <div className="mt-1 space-y-1">
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
                                Membro desde {formatDate(student.joinDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(student.status)}`}
                          >
                            {getStatusText(student.status)}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="dark-glass dark-border hover:dark-border-hover"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              className="dark-glass dark-border hover:dark-border-hover"
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="dark-text-secondary font-medium">
                              Progresso do Perfil
                            </span>
                            <span className="dark-text-primary font-semibold">
                              {student.profileCompletion}%
                            </span>
                          </div>
                          <div className="dark-bg-tertiary h-2 w-full rounded-full">
                            <div
                              className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${student.profileCompletion}%` }}
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="dark-text-secondary text-sm">
                            <BookOpen className="mr-1 inline h-3 w-3" />
                            Inscritos: {student.coursesEnrolled}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            <Award className="mr-1 inline h-3 w-3" />
                            Completados: {student.coursesCompleted}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            <Award className="mr-1 inline h-3 w-3" />
                            Certificados: {student.certificatesEarned}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="dark-text-secondary text-sm">
                            Última atividade: {getTimeAgo(student.lastActivity)}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            CPF: {student.cpf}
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
                  <Users className="dark-text-tertiary" size={24} />
                </div>
                <h3 className="dark-text-primary mb-2 font-semibold">
                  Nenhum aluno encontrado
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  Não há alunos cadastrados no sistema ainda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
