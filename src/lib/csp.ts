const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://mc.yandex.ru https://app.daily-grow.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: https://mc.yandex.ru;
    font-src 'self';
    connect-src 'self' https://mc.yandex.ru https://api.daily-grow.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;

export { cspHeader };
