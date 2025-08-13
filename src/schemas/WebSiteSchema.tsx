import React from "react";

const WebSiteSchema: React.FC = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Красивые номера телефонов",
    alternateName: "Уникальные и премиальные номера телефонов",
    url: "https://vipnomerastore.ru",
    description:
      "Купить красивые и уникальные номера телефонов, быстрая доставка. Лучшие предложения и эксклюзивные номера только у нас.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://vipnomerastore.ru/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Красивые и уникальные номера",
      url: "https://vipnomerastore.ru",
      logo: {
        "@type": "ImageObject",
        url: "https://vipnomerastore.ru/assets/header/logo.svg",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default WebSiteSchema;
