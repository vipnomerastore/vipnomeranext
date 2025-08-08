import Script from "next/script";

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  phone?: string;
  email?: string;
}

export default function OrganizationSchema({
  name,
  url,
  logo,
  description,
  phone,
  email,
}: OrganizationSchemaProps) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    image: logo,
    description,
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Оренбург",
      streetAddress: "пр. Победы 73/1",
      postalCode: "460000",
      addressCountry: "RU",
    },
    sameAs: [
      // Добавьте ваши социальные сети
      "https://t.me/vip_nomerastore",
      "https://wa.me/79333333311",
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationData),
      }}
    />
  );
}
