"use client";

import { PasswordInput } from "@/src/components/password-input";
import { useAuth, usePageTitle } from "@/src/hooks";
import { signUp } from "@/src/lib/actions";
import { signUpSchema, SignUpScheme } from "@/src/lib/forms/auth/signup.scheme";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignUpPage() {
  usePageTitle("Cadastro");

  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  const form = useForm<SignUpScheme>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      cpf: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpScheme) => {
    setIsLoading(true);
    try {
      const result = await signUp({
        name: data.name,
        cpf: data.cpf,
        password: data.password,
      });

      if (result.success) {
        toast.success(
          "Conta criada com sucesso! Aguarde a aprovação da administração.",
        );

        // Atualizar dados do usuário no store
        if (result.user) {
          setUser(result.user);
          router.replace("/pending-approval");
        }
      } else {
        toast.error(result.error || "Erro ao criar conta");
      }
    } catch (error) {
      toast.error("Erro interno do servidor");
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">Criar conta</h1>
            <h2 className="text-foreground-light text-sm">
              Junte-se à nossa comunidade
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Nome completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Seu nome completo"
                      className="dark-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground text-sm font-medium">
                    Senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} className="dark-input" />
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
                    Confirmar senha
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} className="dark-input" />
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
              {isLoading ? "Criando conta..." : "Criar conta"}
            </Button>
          </form>
        </Form>

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
