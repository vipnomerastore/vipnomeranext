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
    description,
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    address: {
      "@type": "PostalAddress",
      addressCountry: "RU",
    },
    sameAs: [
      // Добавьте ваши социальные сети
      "https://t.me/vipnomerastore",
      "https://wa.me/79999999999",
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
