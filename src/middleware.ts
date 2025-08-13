import { NextRequest, NextResponse } from "next/server";
import { getRegionFromRequest } from "@/shared/utils/server-region";
// import { cspHeader } from "@/lib/csp";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const regionFromNginx = request.headers.get("x-region"); // Получаем регион из nginx
  const currentRegionCookie = request.cookies.get("region")?.value;

  // Обработка sitemap.xml для поддоменов
  if (pathname === "/sitemap.xml" && host !== "vipnomerastore.ru") {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "vipnomerastore") {
      // Перенаправляем на специальный sitemap для поддомена
      return NextResponse.rewrite(
        new URL("/subdomain-sitemap.xml", request.url)
      );
    }
  }

  // Обработка robots.txt для поддоменов
  if (pathname === "/robots.txt" && host !== "vipnomerastore.ru") {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "vipnomerastore") {
      // Перенаправляем на специальный robots для поддомена
      return NextResponse.rewrite(
        new URL("/subdomain-robots.txt", request.url)
      );
    }
  }

  const response = NextResponse.next();

  // Определяем регион с приоритетами: nginx -> cookie -> поддомен
  const detectedRegion =
    getRegionFromRequest(host, currentRegionCookie) || regionFromNginx;

  // Если регион определен и отличается от cookie - обновляем
  if (detectedRegion && detectedRegion !== currentRegionCookie) {
    response.cookies.set("region", detectedRegion, {
      maxAge: 60 * 60 * 24 * 30, // 30 дней
      path: "/",
      httpOnly: false, // Нужно для доступа из JavaScript
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  // Добавляем заголовок для клиентских компонентов
  if (detectedRegion) {
    response.headers.set("x-current-region", detectedRegion);
  }

  // Временно отключаем CSP для отладки всех сервисов
  // response.headers.set("Content-Security-Policy", cspHeader.replace(/\n/g, ""));

  // Добавляем заголовки для корректной работы аналитики
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  return response;
}

// Применяем ко всем страницам кроме статических ресурсов
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|assets|api/health).*)"],
};
