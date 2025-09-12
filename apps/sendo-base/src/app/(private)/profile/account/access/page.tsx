"use client";

import {
  getUserProfile,
  updateUserEmail,
  updateUserPassword,
} from "@/src/lib/actions";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Key, Mail, Save, Shield, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileEditAccessPage() {
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailData, setEmailData] = useState({
    currentEmail: "",
    newEmail: "",
    confirmEmail: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const queryClient = useQueryClient();

  const { data: userAuth, isLoading } = useQuery({
    queryKey: ["user", "30d453b9-88c9-429e-9700-81d2db735f7a"],
    queryFn: () => getUserProfile("30d453b9-88c9-429e-9700-81d2db735f7a"),
    select: (data) => data.user,
    onSuccess: (data) => {
      if (data) {
        setEmailData((prev) => ({ ...prev, currentEmail: data.email || "" }));
      }
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: updateUserEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsEditingEmail(false);
      setEmailData((prev) => ({ ...prev, newEmail: "", confirmEmail: "" }));
      toast.success("Email atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar email");
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => {
      setIsEditingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Senha atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar senha");
    },
  });

  const handleEmailSave = () => {
    if (emailData.newEmail !== emailData.confirmEmail) {
      toast.error("Os emails não coincidem");
      return;
    }

    updateEmailMutation.mutate({
      userId: "30d453b9-88c9-429e-9700-81d2db735f7a",
      newEmail: emailData.newEmail,
    });
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    updatePasswordMutation.mutate({
      userId: "30d453b9-88c9-429e-9700-81d2db735f7a",
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handleEmailCancel = () => {
    setEmailData((prev) => ({ ...prev, newEmail: "", confirmEmail: "" }));
    setIsEditingEmail(false);
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditingPassword(false);
  };

  if (isLoading) {
    return (
      <div className="dark-glass dark-shadow-sm rounded-xl p-8 text-center">
        <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Shield className="dark-text-tertiary" size={32} />
        </div>
        <h3 className="dark-text-primary mb-2 text-xl font-semibold">
          Carregando dados...
        </h3>
        <p className="dark-text-secondary">
          Buscando suas informações de acesso
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="dark-text-primary mb-2 text-xl font-semibold">
              Dados de acesso
            </h2>
            <p className="dark-text-secondary text-sm">
              Altere seu email e senha de acesso à plataforma
            </p>
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="dark-text-primary mb-2 flex items-center gap-2 font-semibold">
              <Mail size={20} />
              Email de acesso
            </h3>
            <p className="dark-text-secondary text-sm">
              {isEditingEmail
                ? "Digite seu novo email e confirme a alteração"
                : "Altere o email usado para fazer login na plataforma"}
            </p>
          </div>
          {!isEditingEmail && (
            <Button
              onClick={() => setIsEditingEmail(true)}
              size="sm"
              className="dark-btn-primary"
            >
              <Mail size={16} className="mr-1" />
              Alterar
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentEmail" className="dark-text-secondary">
              Email atual
            </Label>
            <Input
              id="currentEmail"
              value={emailData.currentEmail}
              disabled
              className="dark-input"
            />
          </div>

          {isEditingEmail && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newEmail" className="dark-text-secondary">
                  Novo email *
                </Label>
                <Input
                  id="newEmail"
                  type="email"
                  value={emailData.newEmail}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      newEmail: e.target.value,
                    }))
                  }
                  className="dark-input"
                  placeholder="seu.novo.email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmEmail" className="dark-text-secondary">
                  Confirmar novo email *
                </Label>
                <Input
                  id="confirmEmail"
                  type="email"
                  value={emailData.confirmEmail}
                  onChange={(e) =>
                    setEmailData((prev) => ({
                      ...prev,
                      confirmEmail: e.target.value,
                    }))
                  }
                  className="dark-input"
                  placeholder="seu.novo.email@exemplo.com"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  onClick={handleEmailCancel}
                  variant="ghost"
                  className="hover:dark-bg-tertiary"
                >
                  <X size={16} className="mr-1" />
                  Cancelar
                </Button>
                <Button
                  onClick={handleEmailSave}
                  className="dark-btn-primary"
                  disabled={
                    updateEmailMutation.isPending ||
                    !emailData.newEmail ||
                    !emailData.confirmEmail
                  }
                >
                  <Save size={16} className="mr-1" />
                  {updateEmailMutation.isPending
                    ? "Salvando..."
                    : "Salvar Email"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Password Section */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="dark-text-primary mb-2 flex items-center gap-2 font-semibold">
              <Key size={20} />
              Senha de acesso
            </h3>
            <p className="dark-text-secondary text-sm">
              {isEditingPassword
                ? "Digite sua senha atual e a nova senha"
                : "Altere sua senha para manter sua conta segura"}
            </p>
          </div>
          {!isEditingPassword && (
            <Button
              onClick={() => setIsEditingPassword(true)}
              size="sm"
              className="dark-btn-primary"
            >
              <Key size={16} className="mr-1" />
              Alterar
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="dark-text-secondary">
              Senha atual
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                disabled={!isEditingPassword}
                className="dark-input pr-10"
                placeholder={
                  isEditingPassword ? "Digite sua senha atual" : "••••••••"
                }
              />
              {isEditingPassword && (
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="dark-text-tertiary hover:dark-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              )}
            </div>
          </div>

          {isEditingPassword && (
            <>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="dark-text-secondary">
                  Nova senha *
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="dark-input pr-10"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="dark-text-tertiary hover:dark-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="dark-text-secondary"
                >
                  Confirmar nova senha *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="dark-input pr-10"
                    placeholder="Digite a nova senha novamente"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="dark-text-tertiary hover:dark-text-primary absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  onClick={handlePasswordCancel}
                  variant="ghost"
                  className="hover:dark-bg-tertiary"
                >
                  <X size={16} className="mr-1" />
                  Cancelar
                </Button>
                <Button
                  onClick={handlePasswordSave}
                  className="dark-btn-primary"
                  disabled={
                    updatePasswordMutation.isPending ||
                    !passwordData.currentPassword ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                  }
                >
                  <Save size={16} className="mr-1" />
                  {updatePasswordMutation.isPending
                    ? "Salvando..."
                    : "Salvar Senha"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
          <Shield size={20} />
          Dicas de Segurança
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="dark-primary-subtle-bg mt-1 flex h-2 w-2 rounded-full" />
            <p className="dark-text-secondary text-sm">
              Use uma senha forte com pelo menos 8 caracteres, incluindo letras,
              números e símbolos
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="dark-primary-subtle-bg mt-1 flex h-2 w-2 rounded-full" />
            <p className="dark-text-secondary text-sm">
              Não compartilhe suas credenciais de acesso com outras pessoas
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="dark-primary-subtle-bg mt-1 flex h-2 w-2 rounded-full" />
            <p className="dark-text-secondary text-sm">
              Sempre faça logout ao usar computadores compartilhados
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="dark-primary-subtle-bg mt-1 flex h-2 w-2 rounded-full" />
            <p className="dark-text-secondary text-sm">
              Mantenha seu email de acesso sempre atualizado para receber
              notificações importantes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
