import { Metadata } from "next";

import CreditPageClient from "./CreditPageClient";
import { regionName, regionDisplay } from "@/shared/utils";
import { getServerRegion } from "@/hooks/useServerRegion";
import OrganizationSchema from "@/schemas/OrganizationSchema";
import ProductSchema from "@/schemas/ProductSchema";
import LocalBusinessSchema from "@/schemas/LocalBusinessSchema";

// Dynamic - лучший SEO с региональными meta для каждого пользователя
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  // Получаем регион пользователя для персонализированных meta
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const cityIn = regionDisplay(region);

  // Если есть регион - используем его в meta, иначе дефолт
  const title =
    region !== "default"
      ? `Рассрочка без банка ${cityIn} | vipnomerastore.ru`
      : `Рассрочка без банка | vipnomerastore.ru`;

  const description =
    region !== "default"
      ? `Оформите рассрочку на красивые номера телефона ${cityIn} без участия банка. Удобные условия и быстрый процесс оформления.`
      : `Оформите рассрочку на красивые номера телефона без участия банка. Удобные условия и быстрый процесс оформления.`;

  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/credit`
      : `https://vipnomerastore.ru/credit`;

  return {
    title,
    description,
    keywords:
      region !== "default"
        ? `рассрочка ${city}, купить в рассрочку ${city}, номера в рассрочку ${city}, рассрочка без банка, рассрочка на номера телефонов`
        : `рассрочка, купить в рассрочку, номера в рассрочку, рассрочка без банка, рассрочка на номера телефонов, рассрочка без банка на номера телефонов`,
    openGraph: {
      title,
      description,
      url: siteUrl,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CreditPage() {
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const cityIn = regionDisplay(region);
  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/credit`
      : `https://vipnomerastore.ru/credit`;

  return (
    <>
      <OrganizationSchema
        name="VIP nomera store"
        url={siteUrl}
        logo="https://vipnomerastore.ru/assets/header/logo.svg"
        description={`Рассрочка на красивые номера телефонов ${
          region !== "default" ? cityIn : "по всей России"
        }`}
        phone="+7 (933) 333-33-11"
      />

      <ProductSchema
        name={`Рассрочка на номера ${region !== "default" ? cityIn : ""}`}
        price={2990}
        phoneNumber="Рассрочка без банка на любые номера"
        operator="МТС, Билайн, Мегафон, Теле2, Йота"
        url={siteUrl}
      />

      <LocalBusinessSchema region="Россия" city={city} url={siteUrl} />

      <CreditPageClient />
    </>
  );
}
