import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VIP nomera store – Купить красивые VIP номера телефонов",
    short_name: "VIP nomera",
    description:
      "Лучший выбор красивых VIP номеров телефонов с доставкой по всей России. Эксклюзивные номера от всех операторов.",
    start_url: "/",
    display: "standalone",
    background_color: "#1e293b",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/favicon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/favicon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
