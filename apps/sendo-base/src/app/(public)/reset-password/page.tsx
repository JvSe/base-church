"use client";

import { PasswordInput } from "@/src/components/password-input";
import { usePageTitle } from "@/src/hooks";
import {
  resetPassword,
  validateResetToken,
} from "@/src/lib/actions/password-reset";
import { Button } from "@base-church/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@base-church/ui/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Key, Loader2, Lock, User } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordScheme = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  usePageTitle("Redefinir Senha");

  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name: string;
    email?: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordScheme>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Validar token ao carregar a página
  useEffect(() => {
    async function validateToken() {
      if (!token) {
        setTokenError("Token não fornecido");
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      const result = await validateResetToken(token);

      if (result.success && result.user) {
        setUserData({
          name: result.user.name || "Usuário",
          email: result.user.email || undefined,
        });
        setTokenError(null);
      } else {
        setTokenError(result.error || "Token inválido");
      }

      setIsValidating(false);
    }

    validateToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordScheme) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const result = await resetPassword(token, data.password);

      if (result.success) {
        toast.success("Senha alterada com sucesso!", {
          description: "Você pode fazer login com sua nova senha.",
        });
        router.push("/signin");
      } else {
        toast.error("Erro ao alterar senha", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Erro ao alterar senha", {
        description: "Tente novamente mais tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="dark-bg-primary flex min-h-screen items-center justify-center p-4">
        <div className="dark-glass dark-border w-full max-w-md rounded-2xl p-8 text-center shadow-2xl">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
          <p className="dark-text-primary text-lg font-semibold">
            Validando link...
          </p>
          <p className="dark-text-secondary mt-2 text-sm">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Token error state
  if (tokenError) {
    return (
      <div className="dark-bg-primary flex min-h-screen items-center justify-center p-4">
        <div className="dark-glass dark-border w-full max-w-md rounded-2xl p-8 text-center shadow-2xl">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="dark-text-primary mb-2 text-2xl font-bold">
            Link Inválido
          </h1>
          <p className="dark-text-secondary mb-6 text-sm">{tokenError}</p>
          <Button
            onClick={() => router.push("/signin")}
            className="w-full"
            variant="outline"
          >
            Ir para Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-bg-primary flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative h-20 w-20">
              <Image
                src="/assets/svg/send-base.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Card Principal */}
        <div className="dark-glass dark-border rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                <Key className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Redefinir Senha
            </h1>
            <p className="dark-text-secondary text-sm">
              Olá, <span className="font-semibold">{userData?.name}</span>!
              <br />
              Crie uma nova senha para acessar sua conta.
            </p>
          </div>

          {/* User Info Card */}
          {userData && (
            <div className="dark-bg-secondary mb-6 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="dark-text-primary text-sm font-semibold">
                    {userData.name}
                  </p>
                  {userData.email && (
                    <p className="dark-text-secondary mt-1 text-xs">
                      {userData.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Nova Senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark-text-primary text-sm font-semibold">
                      Nova Senha
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Digite sua nova senha"
                        disabled={isLoading}
                        className="dark-glass dark-border"
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Mínimo 8 caracteres, com maiúscula, minúscula e número
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmar Nova Senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark-text-primary text-sm font-semibold">
                      Confirmar Nova Senha
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Confirme sua nova senha"
                        disabled={isLoading}
                        className="dark-glass dark-border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Alterando senha...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Alterar Senha
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Security Note */}
          <div className="dark-bg-secondary mt-6 rounded-lg p-3">
            <p className="dark-text-tertiary text-center text-xs">
              🔒 Sua nova senha será criptografada e armazenada com segurança
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="dark-text-tertiary text-xs">
            Lembrou sua senha?{" "}
            <button
              onClick={() => router.push("/signin")}
              className="text-blue-600 hover:underline dark:text-blue-400"
              type="button"
            >
              Fazer login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="dark-bg-primary flex min-h-screen items-center justify-center p-4">
          <div className="dark-glass dark-border w-full max-w-md rounded-2xl p-8 text-center shadow-2xl">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-500" />
            <p className="dark-text-primary text-lg font-semibold">
              Carregando...
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
