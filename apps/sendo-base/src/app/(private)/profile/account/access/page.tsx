"use client";

import { useAuth, usePageTitle } from "@/src/hooks";
import { updateUserPassword } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import { Label } from "@base-church/ui/components/label";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Key, Save, Shield, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfileEditAccessPage() {
  usePageTitle("Acesso e Segurança");

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { user } = useAuth();

  const updatePasswordMutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: (result) => {
      if (result.success) {
        setIsEditingPassword(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Senha atualizada com sucesso!");
      } else {
        toast.error(result.error || "Erro ao atualizar senha");
      }
    },
    onError: () => {
      toast.error("Erro ao atualizar senha. Tente novamente.");
    },
  });

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!user?.id) {
      toast.error("Usuário não identificado");
      return;
    }

    updatePasswordMutation.mutate({
      userId: user.id,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const handlePasswordCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditingPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="dark-text-primary text-2xl font-bold">
            Dados de acesso
          </h1>
          <p className="dark-text-secondary mt-1">
            Altere sua senha de acesso à plataforma
          </p>
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
              Altere sua senha periodicamente para manter sua conta mais segura
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
