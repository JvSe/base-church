import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionFromRequest } from "./lib/helpers/session.helper";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso direto a assets estáticos
  if (pathname.startsWith("/assets")) {
    return NextResponse.next();
  }

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = [
    "/signin",
    "/signup",
    "/logout",
    "/forgot-password",
    "/reset-password",
    "/pending-approval",
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Verificar se o usuário está autenticado
  const session = getSessionFromRequest(request);

  // Redirecionar página inicial para login se não estiver autenticado
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // Se é uma rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Se não está autenticado e tentando acessar rota privada, redirecionar para login
  if (!session) {
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Verificar se o usuário está aprovado
  if (session.approvalStatus === "PENDING") {
    // Redirecionar usuários não aprovados para página de aguardando aprovação
    return NextResponse.redirect(new URL("/pending-approval", request.url));
  }

  // Verificar se é uma rota do dashboard (apenas para admins)
  const isDashboardRoute = pathname.startsWith("/dashboard");
  if (isDashboardRoute && session.role !== "ADMIN") {
    // Redirecionar usuários não-admins para home
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
