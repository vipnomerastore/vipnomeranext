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
    description: `Красивый VIP номер телефона ${phoneNumber} оператора ${operator}. Эксклюзивный номер для статуса и запоминаемости.`,
    brand: {
      "@type": "Brand",
      name: operator,
    },
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VIP nomera store",
      },
    },
    image: image,
    url: url,
    category: "Telecommunications",
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
