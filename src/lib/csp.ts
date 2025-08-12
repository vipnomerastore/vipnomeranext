const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://mc.yandex.ru https://mc.yandex.com https://app.daily-grow.com https://app.reviewlab.ru https://api-maps.yandex.ru;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: https://mc.yandex.ru https://mc.yandex.com;
    font-src 'self' data:;
    connect-src 'self' https://mc.yandex.ru https://mc.yandex.com https://app.daily-grow.com https://api.daily-grow.com;
    frame-src 'self' https://mc.yandex.com https://mc.yandex.ru;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
`;

export { cspHeader };
