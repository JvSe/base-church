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
    <div className="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
      <div className="flex flex-col gap-5 mt-auto mb-auto">
        <div className="flex flex-col gap-4">
          <div className="mb-10">
            <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">Vamos Começar</h1>
            <h2 className="text-sm text-foreground-light">
              Crie uma nova conta
            </h2>
          </div>
          <Button variant="outline" className="font-semibold gap-2">
            <FaGoogle /> Cadastro com Google
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 border border-neutral-600 h-0" />
          <p>ou</p>
          <div className="flex-1 border border-neutral-600 h-0" />
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="font-semibold mt-4" size="lg">
              Cadastrar
            </Button>

            <p className="text-foreground-light text-sm text-center mt-8">
              Tem uma conta?{" "}
              <a
                className="underline transition text-foreground hover:text-foreground-light"
                href="signin"
              >
                Faça seu login
              </a>
            </p>
          </form>
        </Form>
      </div>
      <p className="text-xs text-foreground-lighter sm:mx-auto sm:max-w-sm text-center mt-auto">
        By continuing, you agree to Agendify&apos;s{" "}
        <a className="underline">Terms of Service</a> and{" "}
        <a className="underline">Privacy Policy</a>, and to receive periodic
        emails with updates.
      </p>
    </div>
  );
}
