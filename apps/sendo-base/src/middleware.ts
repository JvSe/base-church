import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/helpers/session.helper";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/signin",
    "/signup",
    "/logout",
    "/",
    "/forgot-password",
    "/reset-password",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Se é uma rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar se o usuário está autenticado
  const session = getSessionFromRequest(request);

  // Se não está autenticado e tentando acessar rota privada, redirecionar para login
  if (!session) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Verificar se é uma rota do dashboard (apenas para líderes)
  const isDashboardRoute = pathname.startsWith("/dashboard");
  if (isDashboardRoute && session.role !== "LIDER") {
    // Redirecionar usuários não-líderes para home
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Se está autenticado, permitir acesso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
