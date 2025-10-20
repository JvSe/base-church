"use client";

import { usePageTitle } from "@/src/hooks";
import { signOut } from "@/src/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function LogoutPage() {
  usePageTitle("Saindo");

  const router = useRouter();

  const loading = useRef(false);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        loading.current = true;
        const result = await signOut();

        if (result.success) {
          toast.success("Logout realizado com sucesso!");
          setTimeout(() => {
            router.push("/signin");
          }, 1000);
        }
      } catch (error) {
        toast.error("Erro interno do servidor");
        router.push("/home");
      } finally {
        loading.current = false;
      }
    };

    if (!loading.current) handleLogout();
  }, [router]);

  return (
    <div className="flex h-full items-center justify-center">
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
