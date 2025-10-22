import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "sendo-base-session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em millisegundos
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 dias em segundos

export type SessionData = {
  userId: string;
  cpf: string;
  name: string;
  role: string;
  email?: string;
  approvalStatus?: string;
};

/**
 * Cria e seta uma sessão para o usuário usando a API de cookies do Next.js
 * @param userData - Dados do usuário para a sessão
 * OTIMIZADO: Melhor error handling e performance
 */
export async function createSession(userData: SessionData): Promise<void> {
  try {
    const sessionData = {
      ...userData,
      expiresAt: Date.now() + SESSION_DURATION,
    };

    const cookieValue = Buffer.from(JSON.stringify(sessionData)).toString(
      "base64",
    );
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Falha ao criar sessão do usuário");
  }
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
 * Remove a sessão do usuário (logout) usando a API de cookies do Next.js
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
