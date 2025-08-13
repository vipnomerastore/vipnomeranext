interface ProductSchemaProps {
  name: string;
  price: number;
  phoneNumber: string;
  operator: string;
  url: string;
  image?: string;
}

export default function ProductSchema({
  name,
  price,
  phoneNumber,
  operator,
  url,
  image = "/og-image.jpg",
}: ProductSchemaProps) {
  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: `Красивые номера телефона ${phoneNumber} оператора ${operator}. Эксклюзивный номер для статуса и запоминаемости.`,
    brand: {
      "@type": "Brand",
      name: operator,
    },
    image,
    url,
    category: "Telecommunications",
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "RUB",
      priceValidUntil: "2026-08-08",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VIP nomera store",
      },
      shippingDetails: {
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
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "RU",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      },
    },
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
        reviewBody: "Отличный сервис! Быстрая доставка, всё чётко.",
      },
    ],
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
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
    />
  );
}
