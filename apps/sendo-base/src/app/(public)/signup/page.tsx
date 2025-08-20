"use client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";

import {
  SignUpForms,
  signupScheme,
} from "@/src/lib/forms/authentication/signup.scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
export default function SignUpPage() {
  const form = useForm<SignUpForms>({
    resolver: zodResolver(signupScheme),
  });

  return (
    <div className="flex w-[330px] flex-1 flex-col justify-center sm:w-[384px]">
      <div className="mt-auto mb-auto flex flex-col gap-5">
        <div className="flex flex-col gap-4">
          <div className="mb-10">
            <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">Vamos Começar</h1>
            <h2 className="text-foreground-light text-sm">
              Crie uma nova conta
            </h2>
          </div>
          <Button variant="outline" className="gap-2 font-semibold">
            <FaGoogle /> Cadastro com Google
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-0 flex-1 border border-neutral-600" />
          <p>ou</p>
          <div className="h-0 flex-1 border border-neutral-600" />
        </div>
        <Form {...form}>
          <form className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
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
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="mt-4 font-semibold" size="lg">
              Cadastrar
            </Button>

            <p className="text-foreground-light mt-8 text-center text-sm">
              Tem uma conta?{" "}
              <a
                className="text-foreground hover:text-foreground-light underline transition"
                href="signin"
              >
                Faça seu login
              </a>
            </p>
          </form>
        </Form>
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
