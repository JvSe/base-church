import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import Image from "next/image";

export default function SigInPage() {
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

        <div className="flex flex-col gap-4">
          <Input placeholder="you@example.com" />
          <Input type="password" placeholder="••••••••" />
          <Button className="bg-primary-2 mt-4 font-semibold" size="lg">
            Login
          </Button>

          <p className="text-foreground-light mt-8 text-center text-sm">
            Não tem uma conta?{" "}
            <a
              className="text-foreground hover:text-foreground-light underline transition"
              href="signup"
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
