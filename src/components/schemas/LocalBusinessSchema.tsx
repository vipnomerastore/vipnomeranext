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
            description:
              "Красивый VIP номер телефона МТС. Эксклюзивный номер для статуса и запоминаемости.",
            image: "https://vipnomerastore.ru/og-image.jpg",
            category: "Telecommunications",
            offers: {
              "@type": "Offer",
              price: 2499,
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: 0,
                  currency: "RUB",
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  businessDays: "Mo-Su",
                },
              },
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "RU",
                returnPolicyCategory: "https://schema.org/NoReturns",
              },
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "VIP номера Билайн",
            description:
              "Красивый VIP номер телефона Билайн. Эксклюзивный номер для статуса и запоминаемости.",
            image: "https://vipnomerastore.ru/og-image.jpg",
            category: "Telecommunications",
            offers: {
              "@type": "Offer",
              price: 2499,
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: 0,
                  currency: "RUB",
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  businessDays: "Mo-Su",
                },
              },
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "RU",
                returnPolicyCategory: "https://schema.org/NoReturns",
              },
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "VIP номера Мегафон",
            description:
              "Красивый VIP номер телефона Мегафон. Эксклюзивный номер для статуса и запоминаемости.",
            image: "https://vipnomerastore.ru/og-image.jpg",
            category: "Telecommunications",
            offers: {
              "@type": "Offer",
              price: 2499,
              priceCurrency: "RUB",
              availability: "https://schema.org/InStock",
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                  "@type": "MonetaryAmount",
                  value: 0,
                  currency: "RUB",
                },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  businessDays: "Mo-Su",
                },
              },
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "RU",
                returnPolicyCategory: "https://schema.org/NoReturns",
              },
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
