import { NextRequest, NextResponse } from "next/server";

import { getRegionFromRequest } from "@/shared/utils/server-region";
import { cspHeader } from "@/lib/csp";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;
  const regionFromNginx = request.headers.get("x-region");
  const currentRegionCookie = request.cookies.get("region")?.value;

  // 1️⃣ Пропуск основного sitemap для vipnomerastore.ru и localhost
  if (
    pathname === "/sitemap.xml" &&
    (host === "vipnomerastore.ru" || host.startsWith("localhost"))
  ) {
    return NextResponse.next();
  }

  // Обработка sitemap.xml для поддоменов
  if (
    (pathname === "/sitemap.xml" || pathname === "/robots.txt") &&
    host !== "vipnomerastore.ru"
  ) {
    const subdomain = host.split(".")[0];

    if (subdomain && subdomain !== "vipnomerastore") {
      const rewritePath =
        pathname === "/sitemap.xml"
          ? "/subdomain-sitemap.xml"
          : "/subdomain-robots.txt";

      return NextResponse.rewrite(new URL(rewritePath, request.url));
    }
  }

  const response = NextResponse.next();

  // Определяем регион с приоритетами: nginx -> cookie -> поддомен
  const detectedRegion =
    getRegionFromRequest(host, currentRegionCookie) || regionFromNginx;

  // Обновляем cookie, если регион определён и отличается
  if (detectedRegion && detectedRegion !== currentRegionCookie) {
    response.cookies.set("region", detectedRegion, {
      maxAge: 60 * 60 * 24 * 30, // 30 дней
      path: "/",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  // Передаём регион в заголовке
  if (detectedRegion) {
    response.headers.set("x-current-region", detectedRegion);
  }

  // // Безопасная CSP с поддержкой Яндекс.Метрики, GTM и прочих сервисов
  // const safeCsp = cspHeader
  //   .replace(/\n/g, "") // удаляем переносы строк
  //   .replace("PLACEHOLDER", crypto.randomUUID()); // добавляем nonce для inline скриптов при необходимости

  // response.headers.set("Content-Security-Policy", safeCsp);

  // Дополнительные заголовки для аналитики
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  return response;
}

// Применяем ко всем страницам кроме статических ресурсов
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|assets|api/health).*)"],
};
