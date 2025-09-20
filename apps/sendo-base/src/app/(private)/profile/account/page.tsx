"use client";

import { getUserProfile } from "@/src/lib/actions";
import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  Download,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";

export default function ProfileEditOverviewPage() {
  const { data: userAuth } = useQuery({
    queryKey: ["user", "30d453b9-88c9-429e-9700-81d2db735f7a"],
    queryFn: () => getUserProfile("30d453b9-88c9-429e-9700-81d2db735f7a"),
    select: (data) => data.user,
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const coursesCompleted =
    userAuth?.enrollments?.filter((e) => e.completedAt)?.length || 0;
  const certificatesEarned = userAuth?.certificates?.length || 0;
  const hoursStudied =
    userAuth?.enrollments?.reduce((total: number, enrollment: any) => {
      return total + (enrollment.course?.duration || 0);
    }, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Personal Data Card */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dark-text-primary flex items-center gap-2 font-semibold">
              <User size={20} />
              Dados pessoais
            </h3>
            <Button
              asChild
              size="sm"
              className="dark-glass dark-border hover:dark-border-hover"
            >
              <Link href="/profile/account/personal">
                <Edit size={14} className="mr-1" />
                Alterar
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="dark-text-tertiary" size={16} />
              <div>
                <p className="dark-text-secondary text-sm font-medium">
                  {userAuth?.name || "Nome não definido"}
                </p>
                <p className="dark-text-tertiary text-xs">Nome completo</p>
              </div>
            </div>

            {userAuth?.bio && (
              <div className="flex items-start space-x-3">
                <User className="dark-text-tertiary mt-0.5" size={16} />
                <div>
                  <p className="dark-text-secondary text-sm">
                    {userAuth.bio.length > 60
                      ? `${userAuth.bio.substring(0, 60)}...`
                      : userAuth.bio}
                  </p>
                  <p className="dark-text-tertiary text-xs">Biografia</p>
                </div>
              </div>
            )}

            {(userAuth?.city || userAuth?.state) && (
              <div className="flex items-center space-x-3">
                <MapPin className="dark-text-tertiary" size={16} />
                <div>
                  <p className="dark-text-secondary text-sm font-medium">
                    {[userAuth?.city, userAuth?.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p className="dark-text-tertiary text-xs">Localização</p>
                </div>
              </div>
            )}

            {userAuth?.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="dark-text-tertiary" size={16} />
                <div>
                  <p className="dark-text-secondary text-sm font-medium">
                    {userAuth.phone}
                  </p>
                  <p className="dark-text-tertiary text-xs">Telefone</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Access Data Card */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dark-text-primary flex items-center gap-2 font-semibold">
              <Shield size={20} />
              Dados de acesso
            </h3>
            <Button
              asChild
              size="sm"
              className="dark-glass dark-border hover:dark-border-hover"
            >
              <Link href="/profile/account/access">
                <Edit size={14} className="mr-1" />
                Alterar
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="dark-text-tertiary" size={16} />
              <div>
                <p className="dark-text-secondary text-sm font-medium">
                  {userAuth?.email || "Email não definido"}
                </p>
                <p className="dark-text-tertiary text-xs">Email de acesso</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="dark-text-tertiary" size={16} />
              <div>
                <p className="dark-text-secondary text-sm font-medium">
                  ••••••••
                </p>
                <p className="dark-text-tertiary text-xs">Senha</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="dark-text-tertiary" size={16} />
              <div>
                <p className="dark-text-secondary text-sm font-medium">
                  {formatDate(userAuth?.joinDate ?? new Date())}
                </p>
                <p className="dark-text-tertiary text-xs">Membro desde</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Courses Progress */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dark-text-primary flex items-center gap-2 font-semibold">
              <BookOpen size={20} />
              Cursos
            </h3>
            <Button
              asChild
              size="sm"
              className="dark-glass dark-border hover:dark-border-hover"
            >
              <Link href="/contents">Ver todos</Link>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">Concluídos</span>
              <span className="dark-text-primary font-semibold">
                {coursesCompleted}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">Em andamento</span>
              <span className="dark-text-primary font-semibold">
                {userAuth?.enrollments?.filter(
                  (e) => e?.progress && e?.progress > 0 && e?.progress < 100,
                )?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">
                Horas estudadas
              </span>
              <span className="dark-text-primary font-semibold">
                {Math.round(hoursStudied / 60)}h
              </span>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dark-text-primary flex items-center gap-2 font-semibold">
              <Award size={20} />
              Certificados
            </h3>
            {certificatesEarned > 0 && (
              <Button
                size="sm"
                className="dark-glass dark-border hover:dark-border-hover"
              >
                <Download size={14} className="mr-1" />
                Baixar
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">Emitidos</span>
              <span className="dark-text-primary font-semibold">
                {certificatesEarned}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">Disponíveis</span>
              <span className="dark-text-primary font-semibold">
                {userAuth?.enrollments?.filter(
                  (e) => e.completedAt && e.course?.certificate,
                )?.length || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {/* <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="dark-text-primary flex items-center gap-2 font-semibold">
              <Settings size={20} />
              Notificações
            </h3>
            <Button
              asChild
              size="sm"
              className="dark-glass dark-border hover:dark-border-hover"
            >
              <Link href="/profile/account/notifications">
                <Edit size={14} className="mr-1" />
                Configurar
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">Email</span>
              <span className="dark-success text-sm font-medium">Ativo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">Push</span>
              <span className="dark-success text-sm font-medium">Ativo</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="dark-text-secondary text-sm">SMS</span>
              <span className="dark-text-tertiary text-sm">Inativo</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
