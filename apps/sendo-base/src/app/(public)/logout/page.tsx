"use client";

import { signOut } from "@/src/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const result = await signOut();

        if (result.success) {
          // Limpar cookie de sessão
          if (result.sessionCookie) {
            document.cookie = result.sessionCookie;
          }

          toast.success("Logout realizado com sucesso!");
          router.push("/signin");
        } else {
          toast.error("Erro ao fazer logout");
          router.push("/home");
        }
      } catch (error) {
        toast.error("Erro interno do servidor");
        router.push("/home");
      }
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="dark-text-primary mb-4 text-xl font-semibold">
          Fazendo logout...
        </h1>
        <p className="dark-text-secondary">
          Aguarde enquanto você é redirecionado.
        </p>
      </div>
    </div>
  );
}
