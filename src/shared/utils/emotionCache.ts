import createCache from "@emotion/cache";

export const muiCache = createCache({
  key: "mui",
  prepend: true,
  // Отключаем SSR для Emotion, чтобы избежать проблем с гидратацией
  speedy: typeof document !== "undefined",
});
