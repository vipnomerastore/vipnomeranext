const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https:;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' http://localhost:1337 https://mc.yandex.ru https://mc.yandex.com https://app.daily-grow.com https://api.daily-grow.com;
  frame-src 'self' https://mc.yandex.com https://mc.yandex.ru https://www.googletagmanager.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
`;

export { cspHeader };
