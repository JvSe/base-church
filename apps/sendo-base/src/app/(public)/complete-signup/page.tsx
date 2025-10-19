"use client";

import { PasswordInput } from "@/src/components/password-input";
import {
  completeUserSignup,
  validateInviteToken,
} from "@/src/lib/actions/invite";
import {
  completeSignupSchema,
  CompleteSignupScheme,
} from "@/src/lib/forms/auth/complete-signup.scheme";
import { Button } from "@base-church/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@base-church/ui/components/form";
import { Input } from "@base-church/ui/components/input";
import { formatDocument } from "@base-church/ui/helpers/format-document.helper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CompleteSignupPage() {
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

  const form = useForm<CompleteSignupScheme>({
    resolver: zodResolver(completeSignupSchema),
    defaultValues: {
      token: token || "",
      cpf: "",
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
      const result = await validateInviteToken(token);

      if (result.success && result.user) {
        setUserData({
          name: result.user.name || "Usuário",
          email: result.user.email || "",
        });
        setTokenError(null);
      } else {
        setTokenError(result.error || "Token inválido");
      }

      setIsValidating(false);
    }

    validateToken();
  }, [token]);

  const onSubmit = async (data: CompleteSignupScheme) => {
    setIsLoading(true);
    try {
      const result = await completeUserSignup({
        token: data.token,
        cpf: data.cpf,
        password: data.password,
      });

      if (result.success) {
        toast.success("Cadastro completado com sucesso!", {
          description: "Você já está logado e pode começar a explorar.",
        });
        router.push("/home");
      } else {
        toast.error("Erro ao completar cadastro", {
          description: result.error,
        });
      }
    } catch (error) {
      toast.error("Erro ao completar cadastro", {
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
            Validando convite...
          </p>
          <p className="dark-text-secondary mt-2 text-sm">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  // Token error state
  if (tokenError) {
    return (
      <div className="dark-bg-primary flex items-center justify-center p-4">
        <div className="dark-glass dark-border w-full max-w-md rounded-2xl p-8 text-center shadow-2xl">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="dark-text-primary mb-2 text-2xl font-bold">
            Convite Inválido
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
    <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex">
            <Image
              src="/assets/svg/sendo-base.svg"
              alt="Sendo Base Logo"
              width={100}
              height={100}
              className="w-[90px] md:w-[150px]"
            />
          </div>
        </div>

        {/* Card Principal */}
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h1 className="dark-text-primary mb-2 text-2xl font-bold">
            Complete seu Cadastro
          </h1>
        </div>

        {/* User Info Card */}
        {userData && (
          <div className="dark-bg-secondary mb-6 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="dark-text-primary text-sm font-semibold">
                  {userData.name}
                </p>
                {userData.email && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    <p className="dark-text-secondary text-xs">
                      {userData.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {/* CPF */}
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-primary text-sm font-semibold">
                    CPF
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="000.000.000-00"
                      disabled={isLoading}
                      onChange={(e) => {
                        const formatted = formatDocument(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={14}
                      className="dark-glass dark-border"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Senha */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-primary text-sm font-semibold">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Digite sua senha"
                      disabled={isLoading}
                      className="dark-glass dark-border"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirmar Senha */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="dark-text-primary text-sm font-semibold">
                    Confirmar Senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="Confirme sua senha"
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
              className="mt-10 w-full"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completando cadastro...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Completar Cadastro
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="text-foreground-light mt-8 text-center text-sm">
          Já tem uma conta?{" "}
          <a
            className="text-foreground hover:text-foreground-light underline transition"
            href="/signin"
          >
            Entre aqui
          </a>
        </p>
      </div>
      <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
        By continuing, you agree to Sendo Base{" "}
        <a className="underline">Terms of Service</a> and{" "}
        <a className="underline">Privacy Policy</a>, and to receive periodic
        emails with updates.
      </p>
    </div>
  );
}
