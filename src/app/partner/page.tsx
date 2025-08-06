import type { Metadata } from "next";
import { regionDisplay, regionName } from "@/shared/utils";
import { getServerRegion } from "@/hooks/useServerRegion";
import PartnerPageClient from "./PartnerPageClient";
import OrganizationSchema from "@/components/schemas/OrganizationSchema";
import ProductSchema from "@/components/schemas/ProductSchema";
import LocalBusinessSchema from "@/components/schemas/LocalBusinessSchema";

// Динамическая генерация для региональных metadata
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Получаем регион пользователя для персонализированных meta
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const cityIn = regionDisplay(region);

  // Если есть регион - используем его в meta, иначе дефолт
  const title =
    region !== "default"
      ? `Партнёрам ${cityIn} | vipnomerastore.ru`
      : `Партнёрам | vipnomerastore.ru`;

  const description =
    region !== "default"
      ? `Станьте нашим партнёром ${cityIn} и получите доступ к эксклюзивным условиям продажи красивых номеров телефона.`
      : `Станьте нашим партнёром и получите доступ к эксклюзивным условиям продажи красивых номеров телефона.`;

  const url =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/partner`
      : `https://vipnomerastore.ru/partner`;

  return {
    title,
    description,
    keywords:
      region !== "default"
        ? `партнёрская программа ${city}, стать партнёром ${city}, продажа номеров ${city}`
        : `партнёрская программа, стать партнёром, продажа номеров`,
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "OG image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

export default async function PartnerPage() {
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const cityIn = regionDisplay(region);
  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/partner`
      : `https://vipnomerastore.ru/partner`;

  return (
    <>
      <OrganizationSchema
        name="VIP nomera store"
        url={siteUrl}
        logo="https://vipnomerastore.ru/assets/header/logo.svg"
        description={`Партнёрская программа по продаже VIP номеров ${
          region !== "default" ? cityIn : "по всей России"
        }`}
        phone="+7 (933) 333-33-11"
      />

      <ProductSchema
        name={`Партнёрство по продаже номеров ${
          region !== "default" ? cityIn : ""
        }`}
        price={0}
        phoneNumber="Партнёрская программа с высоким доходом"
        operator="Работа с МТС, Билайн, Мегафон, Теле2"
        url={siteUrl}
      />

      <LocalBusinessSchema region="Россия" city={city} url={siteUrl} />

      <PartnerPageClient />
    </>
  );
}
