import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

import EmotionProvider from "@/app/EmotionProvider";
import ClientThemeProvider from "@/app/ClientThemeProvider";
import ClientLayout from "@/app/clientLayout";
import OrganizationSchema from "@/schemas/OrganizationSchema";
import WebSiteSchema from "@/schemas/WebSiteSchema";

import "./globals.css";

export const metadata: Metadata = {
  title: "VIP nomera store – Купить красивые номера телефонов",
  description:
    "Купить красивые номера телефонов с быстрой доставкой по всей России. Эксклюзивные номера от МТС, Билайн, Мегафон, Теле2, Йота. Лучшие цены и гарантия качества.",
  keywords: [
    "VIP номера",
    "купить номер",
    "красивые номера",
    "номера телефонов",
    "уникальные номера",
    "эксклюзивные номера",
    "Купить номер МТС",
    "Купить номер Билайн",
    "Купить номер Мегафон",
    "Купить номер Теле2",
    "Купить номер Йота",
    "номера с доставкой",
    "номера для бизнеса",
    "купить номер телефона",
    "купить красивый номер",
  ],
  metadataBase: new URL("https://vipnomerastore.ru"),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "6d21e35d75423577",
  },
  openGraph: {
    title: "VIP nomera store – Купить красивые номера телефонов",
    description:
      "Купить красивые номера телефонов с быстрой доставкой по всей России. Эксклюзивные номера от МТС, Билайн, Мегафон, Теле2, Йота. Лучшие цены и гарантия качества.",
    url: "https://vipnomerastore.ru",
    siteName: "VIP nomera store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "VIP nomera store – Купить красивые номера телефонов",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Купить красивые номера телефонов",
    description:
      "Купить красивые номера телефонов с быстрой доставкой по всей России. Эксклюзивные номера от всех операторов.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  authors: [{ name: "vipnomerastore", url: "https://vipnomerastore.ru" }],
  applicationName: "vipnomerastore",
  generator: "Next.js",
  category: "shop",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <meta name="yandex-verification" content="6d21e35d75423577" />
        <meta name="referrer" content="origin-when-cross-origin" />

        {/* Yandex Metrica - размещаем в head согласно рекомендациям */}
        <Script
          id="yandex-metrica"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        >
          {`
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        k=e.createElement(t),a=e.getElementsByTagName(t)[0];
        k.async=1; k.src=r; k.crossOrigin="anonymous";
        a.parentNode.insertBefore(k,a)
      })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(99635255, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `}
        </Script>

        {/* Yandex Metrica noscript - тоже в head */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/99635255"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <Script id="dg-social-widget-data" strategy="afterInteractive">
          {`
    if (!window.dgSocialWidgetData) {
      window.dgSocialWidgetData = [];
    }
    window.dgSocialWidgetData.push({
      widgetId: "350e8959-2f2b-46e5-9ca4-0f032d0b19ad",
      apiUrl: "https://app.daily-grow.com/sw/api/v1",
    });
  `}
        </Script>

        <Script
          src="https://app.daily-grow.com/social-widget/init.js"
          strategy="afterInteractive"
          defer
        />

        <div id="modal-root"></div>

        <EmotionProvider>
          <ClientThemeProvider>
            <ClientLayout>{children}</ClientLayout>
          </ClientThemeProvider>
        </EmotionProvider>

        <OrganizationSchema
          name="VIP nomera store"
          url="https://vipnomerastore.ru"
          logo="https://vipnomerastore.ru/assets/header/logo.svg"
          description="Магазин красивых VIP номеров телефонов с быстрой доставкой"
          phone="+7 (933) 333-33-11"
        />

        <WebSiteSchema />

        <SpeedInsights />

        <VercelAnalytics />
      </body>
    </html>
  );
}
