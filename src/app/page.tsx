import { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import ProductSchema from "@/schemas/ProductSchema";
import LocalBusinessSchema from "@/schemas/LocalBusinessSchema";
import OrganizationSchema from "@/schemas/OrganizationSchema";
import WebSiteSchema from "@/schemas/WebSiteSchema";
import { regionName } from "@/shared/utils";
import { getServerRegion } from "@/hooks/useServerRegion";

// Принудительно делаем страницу динамической для лучшего SEO
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru`
      : `https://vipnomerastore.ru`;

  const title =
    region !== "default"
      ? `Купить красивый номер телефона в ${city} | vipnomerastore.ru`
      : `Купить красивый номер телефона | vipnomerastore.ru`;

  const description =
    region !== "default"
      ? `Купите красивые номера телефонов с доставкой в ${city}. Большой выбор эксклюзивных номеров от МТС, Билайн, Мегафон, Теле2, Йота. Быстрая доставка и лучшие цены.`
      : `Купите красивые номера телефонов с доставкой по России. Большой выбор эксклюзивных номеров от МТС, Билайн, Мегафон, Теле2, Йота. Быстрая доставка и лучшие цены.`;

  return {
    title,
    description,
    keywords:
      region !== "default"
        ? `красивые номера, купить номер телефона, доставка номеров, номера телефонов, ${city}`
        : `красивые номера, купить номер телефона, доставка номеров, номера телефонов`,
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
    twitter: {
      card: "summary_large_image",
      title,
      description:
        region !== "default"
          ? `Купите красивый номер телефона с доставкой в ${city}. Большой выбор номеров, удобный поиск и быстрая доставка.`
          : `Купите красивый номер телефона с доставкой по России. Большой выбор номеров, удобный поиск и быстрая доставка.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Home() {
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru`
      : `https://vipnomerastore.ru`;

  return (
    <>
      <WebSiteSchema />

      <OrganizationSchema
        name="VIP nomera store"
        url={siteUrl}
        logo="https://vipnomerastore.ru/assets/header/logo.svg"
        description={`Продажа красивых и эксклюзивных номеров телефонов с доставкой ${
          region !== "default" ? `в ${city}` : "по всей России"
        }`}
        phone="+7 (933) 333-33-11"
      />

      <ProductSchema
        name={`Красивые номера телефонов ${
          region !== "default" ? `в ${city}` : ""
        }`}
        price={2990}
        phoneNumber="Доступны номера всех операторов"
        operator="МТС, Билайн, Мегафон, Теле2, Йота"
        url={siteUrl}
      />

      <LocalBusinessSchema region="Россия" city={city} url={siteUrl} />
      <HomePageClient />
    </>
  );
}
