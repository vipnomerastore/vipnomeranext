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
  const shippingDetails = {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: 0,
      currency: "RUB",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "RU",
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 2,
        unitCode: "d",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 3,
        unitCode: "d",
      },
      businessDays: "Mo-Su",
    },
  };

  const commonProductData = {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      reviewCount: "12",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Иван",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
        reviewBody: "Отличный номер. Всё быстро, удобно и качественно!",
      },
    ],
  };

  const operators = ["МТС", "Билайн", "Мегафон"];

  const itemListElement = operators.map((operator) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Product",
      name: `VIP номера ${operator}`,
      description: `Красивый VIP номер телефона ${operator}. Эксклюзивный номер для статуса и запоминаемости.`,
      image: "https://vipnomerastore.ru/og-image.jpg",
      category: "Telecommunications",
      brand: {
        "@type": "Brand",
        name: operator,
      },
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Тип номера",
          value: "VIP номер телефона",
        },
        {
          "@type": "PropertyValue",
          name: "Оператор",
          value: operator,
        },
      ],
      ...commonProductData,
      offers: {
        "@type": "Offer",
        price: 2499,
        priceCurrency: "RUB",
        priceValidUntil: "2026-08-08",
        availability: "https://schema.org/InStock",
        shippingDetails,
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: "RU",
          returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        },
      },
    },
  }));

  const businessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `VIP nomera store ${city}`,
    description: `Продажа красивых VIP номеров телефонов в ${city}. Быстрая доставка, лучшие цены.`,
    url,
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
      itemListElement,
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
