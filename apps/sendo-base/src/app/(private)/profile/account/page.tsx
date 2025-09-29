"use client";

import { useAuth } from "@/src/hooks";
import { getUserProfile, updateUserProfileData } from "@/src/lib/actions";
import { formatDocument } from "@/src/lib/helpers";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@base-church/ui/components/avatar";
import { Button } from "@base-church/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@base-church/ui/components/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  Download,
  Edit,
  MapPin,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function ProfileEditOverviewPage() {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userAuth } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserProfile(user!.id),
    select: (data) => data.user,
    enabled: !!user?.id,
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  // Mutation para atualizar foto do perfil
  const updatePhotoMutation = useMutation({
    mutationFn: updateUserProfileData,
    onSuccess: (data) => {
      // Atualiza o cache da query com os novos dados
      queryClient.setQueryData(["user", user?.id], (oldData: any) => ({
        ...oldData,
        user: { ...oldData?.user, ...data.user },
      }));

      // Atualiza o estado do useAuth com os dados atualizados
      updateUser({
        image: data.user?.image,
        isPastor: data.user?.isPastor,
        name: data.user?.name,
        role: data.user?.role,
      } as any);

      setShowImageModal(false);
      setSelectedImage(null);
      toast.success("Foto do perfil atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar foto do perfil");
    },
  });

  // Função para abrir seletor de arquivo
  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  // Função para processar arquivo selecionado
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setShowImageModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para salvar a foto
  const handleSavePhoto = () => {
    if (selectedImage) {
      updatePhotoMutation.mutate({
        userId: user!.id,
        data: {
          image: selectedImage,
        },
      });
    }
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

          <div className="flex gap-6">
            {/* Foto do perfil */}
            <div className="flex h-min justify-center">
              <div
                className="group relative cursor-pointer"
                onClick={handleImageSelect}
              >
                <Avatar className="group-hover:ring-primary h-28 w-28 ring-2 ring-transparent transition-all duration-200">
                  <AvatarImage
                    src={userAuth?.image ?? ""}
                    alt={userAuth?.name ?? "Foto do perfil"}
                    className="object-cover"
                  />
                  <AvatarFallback className="dark-bg-tertiary dark-text-primary text-xl font-semibold">
                    {userAuth?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Overlay de hover */}
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            {/* Informações pessoais */}
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
              <User className="dark-text-tertiary" size={16} />
              <div>
                <p className="dark-text-secondary text-sm font-medium">
                  {formatDocument(userAuth?.cpf || "") || "CPF não definido"}
                </p>
                <p className="dark-text-tertiary text-xs">CPF</p>
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

      {/* Modal de Edição de Foto */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="dark-bg-elevated dark-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark-text-primary flex items-center gap-2">
              <Camera size={20} />
              Editar Foto do Perfil
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {selectedImage && (
              <div className="space-y-4">
                {/* Preview da imagem selecionada */}
                <div className="dark-bg-secondary rounded-lg p-4">
                  <h4 className="dark-text-primary mb-3 font-medium">
                    Imagem Selecionada
                  </h4>
                  <div className="flex justify-center">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="max-h-64 max-w-full rounded-full object-contain"
                    />
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedImage(null);
                        setShowImageModal(false);
                      }}
                      className="dark-border dark-text-secondary hover:dark-bg-tertiary"
                    >
                      <X size={14} className="mr-1" />
                      Cancelar
                    </Button>
                  </div>

                  <Button
                    onClick={handleSavePhoto}
                    className="dark-btn-primary"
                    disabled={updatePhotoMutation.isPending}
                  >
                    {updatePhotoMutation.isPending
                      ? "Salvando..."
                      : "Salvar Foto"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
