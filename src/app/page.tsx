import { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import ProductSchema from "@/schemas/ProductSchema";
import LocalBusinessSchema from "@/schemas/LocalBusinessSchema";
import OrganizationSchema from "@/schemas/OrganizationSchema";
import WebSiteSchema from "@/schemas/WebSiteSchema";
import { regionName } from "@/shared/utils";
import regionsData from "./regions-data.json";
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

  // Найти данные по городу в regions-data.json
  let regionMeta = null;

  if (region !== "default") {
    regionMeta = regionsData.find((item) => item["Город"] === city);
  }

  const title =
    regionMeta?.Title ||
    (region !== "default"
      ? `Купить красивый номер телефона ${city} | vipnomerastore.ru`
      : `Купить красивый номер телефона | vipnomerastore.ru`);

  const description =
    regionMeta?.Description ||
    (region !== "default"
      ? `Купите красивые номера телефонов с доставкой ${city}. Большой выбор эксклюзивных номеров от МТС, Билайн, Мегафон, Теле2, Йота. Быстрая доставка и лучшие цены.`
      : `Купите красивые номера телефонов с доставкой по России. Большой выбор эксклюзивных номеров от МТС, Билайн, Мегафон, Теле2, Йота. Быстрая доставка и лучшие цены.`);

  return {
    title,
    description,
    keywords:
      region === "default"
        ? `Купить красивый номер,
Красивый номер телефона,
Красивый мобильный номер,
Красивый номер,
Элитный номер,
Вип номер,
VIP номер,
Золотой номер,
Красивый локальный номер,
Красивый городской номер,
Красивый короткий номер,
Красивый номер МТС,
Красивый номер Билайн,
Красивый номер Мегафон,
Красивый номер Теле2,
Красивый номер Йота,
Красивый номер Т-банк,
Красивый номер Yota,
Красивый номер ВТБ,
Красивый номер СБЕР,
Уникальный номер,
Эксклюзивный номер`
        : `Купить красивый номер ${city},
Красивый номер телефона ${city},
Красивый мобильный номер ${city},
Красивый номер ${city},
Элитный номер ${city},
Вип номер ${city},
VIP номер ${city},
Золотой номер ${city},
Красивый локальный номер ${city},
Красивый городской номер ${city},
Красивый короткий номер ${city},
Красивый номер МТС ${city},
Красивый номер Билайн ${city},
Красивый номер Мегафон ${city},
Красивый номер Теле2 ${city},
Красивый номер Йота ${city},
Красивый номер Т-банк ${city},
Красивый номер Yota ${city},
Красивый номер ВТБ ${city},
Красивый номер СБЕР ${city},
Уникальный номер,
Эксклюзивный номер`,
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
        regionMeta?.Description ||
        (region !== "default"
          ? `Купите красивый номер телефона с доставкой ${city}. Большой выбор номеров, удобный поиск и быстрая доставка.`
          : `Купите красивый номер телефона с доставкой по России. Большой выбор номеров, удобный поиск и быстрая доставка.`),
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
          region !== "default" ? `${city}` : "по всей России"
        }`}
        phone="+7 (933) 333-33-11"
      />

      <ProductSchema
        name={`Красивые номера телефонов ${
          region !== "default" ? `${city}` : ""
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
