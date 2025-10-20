"use client";

import { usePageTitle } from "@/src/hooks";
import { requestPasswordReset } from "@/src/lib/actions";
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
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  cpf: z
    .string()
    .min(1, { message: "CPF é obrigatório" })
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
      message: "CPF deve ter o formato 000.000.000-00",
    }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  usePageTitle("Recuperar Senha");

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      cpf: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset(data.cpf);

      if (result.success) {
        setEmailSent(true);
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao enviar email de recuperação");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
              <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">Email Enviado!</h1>
              <h2 className="text-foreground-light text-sm">
                Verifique sua caixa de entrada
              </h2>
            </div>

            <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
              <div className="dark-primary-subtle-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  className="dark-primary h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                Verifique seu email
              </h3>
              <p className="dark-text-secondary text-sm">
                Enviamos um link de recuperação para o email associado ao CPF
                informado. Clique no link para redefinir sua senha.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setEmailSent(false)}
                className="dark-glass dark-border hover:dark-border-hover w-full"
                variant="outline"
              >
                Tentar outro CPF
              </Button>

              <Link href="/signin">
                <Button className="dark-btn-primary w-full">
                  Voltar ao Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <p className="text-foreground-lighter mt-auto text-center text-xs sm:mx-auto sm:max-w-sm">
          Não recebeu o email? Verifique sua caixa de spam ou{" "}
          <button
            onClick={() => setEmailSent(false)}
            className="hover:text-foreground-light underline transition"
          >
            tente novamente
          </button>
        </p>
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
            <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">Recuperar Senha</h1>
            <h2 className="text-foreground-light text-sm">
              Digite seu CPF para receber um link de recuperação
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
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    CPF
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={formatDocument(field.value)}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/\D/g, "");
                        field.onChange(cleanValue);
                      }}
                      placeholder="000.000.000-00"
                      className="dark-input"
                      maxLength={14}
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
              {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
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
