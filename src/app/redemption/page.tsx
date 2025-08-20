import { Metadata } from "next";
import RedemptionPageClient from "./RedemptionPageClient";
import { regionName, regionDisplay } from "@/shared/utils";
import { getServerRegion } from "@/hooks/useServerRegion";
import OrganizationSchema from "@/schemas/OrganizationSchema";
import ProductSchema from "@/schemas/ProductSchema";
import LocalBusinessSchema from "@/schemas/LocalBusinessSchema";

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
      ? `Продать номер ${cityIn} | vipnomerastore.ru`
      : `Продать номер | vipnomerastore.ru`;

  const description =
    region !== "default"
      ? `Выгодно продайте свой красивый номер телефона ${cityIn}. Быстрая оценка и честная цена за ваш номер.`
      : `Выгодно продайте свой красивый номер телефона. Быстрая оценка и честная цена за ваш номер.`;

  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/redemption`
      : `https://vipnomerastore.ru/redemption`;

  return {
    title,
    description,
    keywords:
      region !== "default"
        ? `продать номер ${city}, выкуп номеров ${city}, оценка номера ${city}`
        : `продать номер, выкуп номеров, оценка номера, мобильные номера,`,
    openGraph: {
      title: `Продать номер ${cityIn} | vipnomerastore.ru`,
      description: `Выгодно продайте свой красивый номер телефона ${cityIn}.`,
      url: siteUrl,
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RedemptionPage() {
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const cityIn = regionDisplay(region);
  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/redemption`
      : `https://vipnomerastore.ru/redemption`;

  return (
    <>
      <OrganizationSchema
        name="VIP nomera store"
        url={siteUrl}
        logo="https://vipnomerastore.ru/assets/header/logo.svg"
        description={`Выкуп номеров телефона ${
          region !== "default" ? cityIn : "по всей России"
        } по выгодным ценам`}
        phone="+7 (933) 333-33-11"
      />

      <ProductSchema
        name={`Выкуп номеров ${region !== "default" ? cityIn : ""}`}
        price={5000}
        phoneNumber="Выкупаем дорогие и красивые номера"
        operator="МТС, Билайн, Мегафон, Теле2"
        url={siteUrl}
      />

      <LocalBusinessSchema region="Россия" city={city} url={siteUrl} />

      <RedemptionPageClient />
    </>
  );
}
