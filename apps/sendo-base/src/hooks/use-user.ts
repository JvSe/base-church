"use client";

import { signOut } from "@/src/lib/actions";
import { useEffect, useState } from "react";
import { User, useUserStore } from "./use-user-store";

export function useUser() {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    clearUser,
    setLoading,
    updateUser,
  } = useUserStore();

  const [isHydrated, setIsHydrated] = useState(false);

  // Função para carregar dados do usuário da sessão
  const loadUserFromSession = async () => {
    try {
      setLoading(true);

      // Verificar se já temos dados no store (persistidos)
      if (user && isAuthenticated) {
        setLoading(false);
        return;
      }

      // Se não temos dados, limpar o store
      clearUser();
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
      clearUser();
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      setLoading(true);

      // Limpar sessão no servidor
      const result = await signOut();

      if (result.success && result.sessionCookie) {
        // Limpar cookie do navegador
        document.cookie = result.sessionCookie;
      }

      // Limpar dados locais
      clearUser();

      // Redirecionar para login
      window.location.href = "/signin";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpar dados locais
      clearUser();
      window.location.href = "/signin";
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar dados do usuário
  const updateUserData = (updates: Partial<User>) => {
    updateUser(updates);
  };

  // Hydration effect - aguarda o componente estar hidratado
  useEffect(() => {
    setIsHydrated(true);
    loadUserFromSession();
  }, []);

  // Retornar estado de loading durante a hidratação
  if (!isHydrated) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      loadUserFromSession,
      logout,
      updateUserData,
      isAdmin: false,
      isMember: false,
      isPastor: false,
      userName: "",
      userEmail: "",
      userCpf: "",
    };
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    loadUserFromSession,
    logout,
    updateUserData,

    // Helpers
    isAdmin: user?.role === "LIDER",
    isMember: user?.role === "MEMBROS",
    isPastor: user?.isPastor || false,
    userName: user?.name || "",
    userEmail: user?.email || "",
    userCpf: user?.cpf || "",
  };
}
