"use client";

import { resetPassword } from "@/src/lib/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Senha é obrigatória" })
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
      .regex(/[A-Z]/, {
        message: "Senha deve conter pelo menos uma letra maiúscula",
      })
      .regex(/[a-z]/, {
        message: "Senha deve conter pelo menos uma letra minúscula",
      })
      .regex(/\d/, { message: "Senha deve conter pelo menos um número" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Senha deve conter pelo menos um caractere especial",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmação de senha é obrigatória" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      // Em produção, o token viria da URL ou de um parâmetro
      const token = "mock-token"; // TODO: Extrair token da URL

      const result = await resetPassword(token, data.password);

      if (result.success) {
        setPasswordReset(true);
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao redefinir senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (passwordReset) {
    return (
      <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
        <div className="mt-auto mb-auto flex flex-col gap-5">
          <Image
            src="/assets/svg/sendo-base.svg"
            alt="Sendo Base Logo"
            width={100}
            height={100}
            className="w-[90px] md:w-[220px]"
          />

          <div className="flex flex-col gap-4">
            <div className="mb-10 text-center">
              <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">
                Senha Redefinida!
              </h1>
              <h2 className="text-foreground-light text-sm">
                Sua senha foi alterada com sucesso
              </h2>
            </div>

            <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
              <div className="dark-success-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  className="dark-success h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                Tudo certo!
              </h3>
              <p className="dark-text-secondary text-sm">
                Sua senha foi redefinida com sucesso. Agora você pode fazer
                login com sua nova senha.
              </p>
            </div>

            <Link href="/signin">
              <Button className="dark-btn-primary w-full">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
      <div className="mt-auto mb-auto flex flex-col gap-5">
        <Image
          src="/assets/svg/sendo-base.svg"
          alt="Sendo Base Logo"
          width={100}
          height={100}
          className="w-[90px] md:w-[220px]"
        />

        <div className="flex flex-col gap-4">
          <div className="mb-10">
            <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">Nova Senha</h1>
            <h2 className="text-foreground-light text-sm">
              Digite sua nova senha abaixo
            </h2>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Nova Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="dark-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Confirmar Nova Senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="dark-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-primary-2 mt-4 font-semibold"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Redefinindo..." : "Redefinir Senha"}
            </Button>
          </form>
        </Form>

        <div className="space-y-3">
          <Link href="/signin">
            <Button
              className="dark-glass dark-border hover:dark-border-hover w-full"
              variant="outline"
            >
              Voltar ao Login
            </Button>
          </Link>
        </div>
      </div>

      <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
        Lembrou da senha?{" "}
        <Link
          className="text-foreground hover:text-foreground-light underline transition"
          href="/signin"
        >
          Fazer login
        </Link>
      </p>
    </div>
  );
}
