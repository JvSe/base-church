"use client";

import { useAuth, usePageTitle } from "@/src/hooks";
import { signOut } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingApprovalPage() {
  usePageTitle("Aguardando Aprovação");

  const { user, clearUser } = useAuth();
  const router = useRouter();

  // Se não há usuário logado, redirecionar para login
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    clearUser();
    router.push("/signin");
  };

  if (!user) {
    return null; // Loading state
  }

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col">
        <div className="flex flex-col items-center justify-center text-center">
          <Image
            src="/assets/svg/sendo-base.svg"
            alt="Sendo Base Logo"
            width={100}
            height={100}
            className="w-[90px] md:w-[220px]"
          />
          <div className="flex flex-col gap-4 text-nowrap">
            <div className="mb-10">
              <h1 className="mt-4 mb-2 text-2xl lg:text-3xl">
                Bem vindo de volta
              </h1>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10">
              <svg
                className="h-8 w-8 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Aguardando Aprovação</h1>
            <p className="text-foreground-light mt-2">
              Sua conta foi criada com sucesso, mas precisa ser aprovada pela
              administração.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-green-500/10 p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-foreground">
                      <strong>Próximos passos:</strong>
                    </p>
                    <ul className="text-foreground-light mt-1 list-inside list-disc space-y-1">
                      <li>Aguarde a aprovação da administração</li>
                      <li>Você receberá um email de confirmação</li>
                      <li>Poderá acessar todos os recursos da plataforma</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10">
              <Button
                onClick={handleSignOut}
                variant="clean"
                className="w-full"
                size="lg"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da conta
              </Button>
            </div>

            <div className="text-center">
              <p className="text-foreground-lighter text-xs">
                Tem dúvidas? Entre em contato com nossa equipe de suporte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
