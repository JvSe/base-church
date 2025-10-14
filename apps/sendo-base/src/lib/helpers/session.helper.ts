import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "sendo-base-session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em millisegundos

export type SessionData = {
  userId: string;
  cpf: string;
  name: string;
  role: string;
  email?: string;
  approvalStatus?: string;
};

/**
 * Cria uma sessão para o usuário
 * @param userData - Dados do usuário para a sessão
 * @returns Cookie string para ser definido
 */
export function createSession(userData: SessionData): string {
  const sessionData = {
    ...userData,
    expiresAt: Date.now() + SESSION_DURATION,
  };

  const cookieValue = Buffer.from(JSON.stringify(sessionData)).toString(
    "base64",
  );

  return `${SESSION_COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_DURATION / 1000}`;
}

/**
 * Obtém a sessão atual do usuário
 * @returns Dados da sessão ou null se não autenticado
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8"),
    );

    // Verificar se a sessão não expirou
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      return null;
    }

    return {
      userId: sessionData.userId,
      cpf: sessionData.cpf,
      name: sessionData.name,
      role: sessionData.role,
      email: sessionData.email,
      approvalStatus: sessionData.approvalStatus,
    };
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Obtém a sessão a partir de uma requisição (para middleware)
 * @param request - Requisição Next.js
 * @returns Dados da sessão ou null se não autenticado
 */
export function getSessionFromRequest(
  request: NextRequest,
): SessionData | null {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8"),
    );

    // Verificar se a sessão não expirou
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      return null;
    }

    return {
      userId: sessionData.userId,
      cpf: sessionData.cpf,
      name: sessionData.name,
      role: sessionData.role,
      email: sessionData.email,
      approvalStatus: sessionData.approvalStatus,
    };
  } catch (error) {
    console.error("Error getting session from request:", error);
    return null;
  }
}

/**
 * Obtém a sessão a partir de um cookieStore (para Server Components)
 * @param cookieStore - ReadonlyRequestCookies do Next.js
 * @returns Dados da sessão ou null se não autenticado
 */
export function getSessionFromCookies(
  cookieStore: ReadonlyRequestCookies,
): SessionData | null {
  try {
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const sessionData = JSON.parse(
      Buffer.from(sessionCookie.value, "base64").toString("utf-8"),
    );

    // Verificar se a sessão não expirou
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      return null;
    }

    return {
      userId: sessionData.userId,
      cpf: sessionData.cpf,
      name: sessionData.name,
      role: sessionData.role,
      email: sessionData.email,
      approvalStatus: sessionData.approvalStatus,
    };
  } catch (error) {
    console.error("Error getting session from cookies:", error);
    return null;
  }
}

/**
 * Remove a sessão do usuário (logout)
 * @returns Cookie string para ser definido (limpa o cookie)
 */
export function clearSession(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}
