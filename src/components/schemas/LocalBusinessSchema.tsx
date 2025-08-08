interface LocalBusinessSchemaProps {
  region: string;
  city: string;
  url: string;
}

export default function LocalBusinessSchema({
  region,
  city,
  url,
}: LocalBusinessSchemaProps) {
  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `VIP nomera store ${city}`,
    description: `Продажа красивых VIP номеров телефонов в ${city}. Быстрая доставка, лучшие цены.`,
    url: url,
    address: {
      "@type": "PostalAddress",
      addressRegion: region,
      addressLocality: "Оренбург",
      streetAddress: "ул. Примерная, д. 1",
      postalCode: "460000",
      addressCountry: "RU",
    },
    telephone: "+7 (999) 999-99-99",
    email: "info@vipnomerastore.ru",
    openingHours: "Mo-Su 09:00-21:00",
    serviceArea: {
      "@type": "City",
      name: city,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "VIP номера телефонов",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "VIP номера МТС",
            category: "Telecommunications",
            offers: {
              "@type": "Offer",
              price: 2499,
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "VIP номера Билайн",
            category: "Telecommunications",
            offers: {
              "@type": "Offer",
              price: 2499,
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "VIP номера Мегафон",
            category: "Telecommunications",
            offers: {
              "@type": "Offer",
              price: 2499,
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
            },
          },
        },
      ],
    },
    priceRange: "от 2499₽",
    image: "https://vipnomerastore.ru/assets/header/logo.svg",
    sameAs: ["https://t.me/vip_nomerastore", "https://wa.me/79333333311"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
    />
  );
}
