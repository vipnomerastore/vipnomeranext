import { NextRequest, NextResponse } from "next/server";
import { getRegionFromRequest } from "@/shared/utils/server-region";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const regionFromNginx = request.headers.get("x-region"); // Получаем регион из nginx
  const currentRegionCookie = request.cookies.get("region")?.value;

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

  return response;
}

// Применяем ко всем страницам кроме статических ресурсов
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|assets|api/health).*)"],
};
