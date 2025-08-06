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
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "VIP номера Билайн",
            category: "Telecommunications",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "VIP номера Мегафон",
            category: "Telecommunications",
          },
        },
      ],
    },
    sameAs: ["https://t.me/vip_nomerastore", "https://wa.me/79333333311"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(businessData) }}
    />
  );
}
