import { Metadata } from "next";
import { regionName, regionDisplay } from "@/shared/utils";
import { getServerRegion } from "@/hooks/useServerRegion";
import OrganizationSchema from "@/schemas/OrganizationSchema";
import ProductSchema from "@/schemas/ProductSchema";
import LocalBusinessSchema from "@/schemas/LocalBusinessSchema";
import PhoneDescriptionalPageClient from "./PhoneDescriptionalPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const cityIn = regionDisplay(region);

  // Здесь можно получить номер из searchParams для более точного SEO
  // const searchParams = await getSearchParams(); // если нужно

  const title =
    region !== "default"
      ? `Описание номера ${cityIn} | vipnomerastore.ru`
      : `Описание номера | vipnomerastore.ru`;

  const description =
    region !== "default"
      ? `Детальное описание красивого номера телефона ${cityIn}. Все характеристики, оператор, цена и условия.`
      : `Детальное описание красивого номера телефона. Все характеристики, оператор, цена и условия.`;

  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/phone-descriptional`
      : `https://vipnomerastore.ru/phone-descriptional`;

  return {
    title,
    description,
    keywords:
      region !== "default"
        ? `описание номера ${city}, характеристики номера ${city}, красивые номера ${city}`
        : `описание номера, характеристики номера, мобильные номера, красивые номера`,
    openGraph: {
      title: `Описание номера ${cityIn} | vipnomerastore.ru`,
      description: `Детальное описание красивого номера телефона ${cityIn}.`,
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
      title: `Описание номера ${cityIn} | vipnomerastore.ru`,
      description: `Детальное описание красивого номера телефона ${cityIn}.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
export default async function PhoneDescriptionalPage() {
  const region = (await getServerRegion()) || "default";
  const city = regionName(region);
  const cityIn = regionDisplay(region);
  const siteUrl =
    region !== "default"
      ? `https://${region}.vipnomerastore.ru/phone-descriptional`
      : `https://vipnomerastore.ru/phone-descriptional`;

  return (
    <>
      <OrganizationSchema
        name="VIP nomera store"
        url={siteUrl}
        logo="https://vipnomerastore.ru/assets/header/logo.svg"
        description={`Описание красивого номера ${
          region !== "default" ? cityIn : "по всей России"
        }`}
        phone="+7 (933) 333-33-11"
      />

      <ProductSchema
        name={`Описание номера ${region !== "default" ? cityIn : ""}`}
        price={10000}
        phoneNumber="Красивый номер для статуса"
        operator="МТС, Билайн, Мегафон, Теле2"
        url={siteUrl}
      />

      <LocalBusinessSchema region="Россия" city={city} url={siteUrl} />

      <PhoneDescriptionalPageClient />
    </>
  );
}
