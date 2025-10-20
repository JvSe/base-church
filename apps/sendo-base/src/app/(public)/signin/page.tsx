"use client";

import { PasswordInput } from "@/src/components/password-input";
import { useAuth, usePageTitle } from "@/src/hooks";
import { signIn } from "@/src/lib/actions";
import { signInSchema, SignInScheme } from "@/src/lib/forms/auth/signin.scheme";
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

export default function SignInPage() {
  usePageTitle("Login");

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  const form = useForm<SignInScheme>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      cpf: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInScheme) => {
    setIsLoading(true);
    try {
      const result = await signIn(data);

      if (result.success) {
        if (result.user) {
          setUser(result.user);
        }

        const userApprovalStatus = (result.user as any)?.approvalStatus;
        if (userApprovalStatus === "APPROVED") {
          toast.success("Login realizado com sucesso!");
          router.replace("/home");
        } else {
          router.push("/pending-approval");
        }
      } else {
        toast.error(result.error || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Signin error:", error);
      toast.error("Erro ao fazer login. Tente novamente.");
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
            <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">
              Bem vindo de volta
            </h1>
            <h2 className="text-foreground-light text-sm">
              Entre na sua conta
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

            <Button
              type="submit"
              className="bg-primary-2 mt-4 font-semibold"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </Form>

        <div className="space-y-3">
          <p className="text-foreground-light text-center text-sm">
            <a
              className="text-foreground hover:text-foreground-light underline transition"
              href="/forgot-password"
            >
              Esqueceu sua senha?
            </a>
          </p>

          <p className="text-foreground-light text-center text-sm">
            Não tem uma conta?{" "}
            <a
              className="text-foreground hover:text-foreground-light underline transition"
              href="/signup"
            >
              Cadastre agora
            </a>
          </p>
        </div>
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
