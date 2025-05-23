import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";

export default function SigInPage() {
  return (
    <div className="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
      <div className="flex flex-col gap-5 mt-auto mb-auto">
        <div className="flex flex-col gap-4">
          <div className="mb-10">
            <h1 className="mt-8 mb-2 text-2xl lg:text-3xl">
              Bem vindo de volta
            </h1>
            <h2 className="text-sm text-foreground-light">
              Entre na sua conta
            </h2>
          </div>
          <Button variant="outline" className="font-semibold gap-2">
            <FaGoogle /> Login com Google
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 border border-neutral-600 h-0" />
          <p>ou</p>
          <div className="flex-1 border border-neutral-600 h-0" />
        </div>
        <div className="flex flex-col gap-4">
          <Input placeholder="you@example.com" />
          <Input type="password" placeholder="••••••••" />
          <Button className="font-semibold mt-4" size="lg">
            Login
          </Button>

          <p className="text-foreground-light text-sm text-center mt-8">
            Não tem uma conta?{" "}
            <a
              className="underline transition text-foreground hover:text-foreground-light"
              href="signup"
            >
              Cadastre agora
            </a>
          </p>
        </div>
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
