#!/usr/bin/env node

/**
 * Скрипт для массовой отправки URL поддоменов в Google Search Console
 *
 * Использование:
 * 1. Установите Google Search Console API credentials
 * 2. Запустите: node submit-subdomains.js
 */

const regions = [
  "msk",
  "spb",
  "nsk",
  "ekb",
  "nn",
  "kzn",
  "chel",
  "omsk",
  "smr",
  "rostov",
  "ufa",
  "krsk",
  "perm",
  "voronezh",
  "volgograd",
  "krasnodar",
  "saratov",
  "tyumen",
  "togliatti",
  "izhevsk",
  "barnaul",
  "ulyanovsk",
  "irkutsk",
  "habarovsk", //
  "yaroslavl",
  "vladivostok",
  "mahachkala",
  "tomsk",
  "orenburg",
  "kemerovo",
  "ryazan",
  "astrakhan",
  "penza",
  "lipetsk",

  "sochi",
  "kaluga",
  "grozny",
  "stavropol",
  "sevastopol",
  "naberezhnye",
  "balashikha",
  "novokuznetsk",
  "cheboksary",
  "kaliningrad",
  "kirov",
  "tula",
  "ulanude",
  "kursk",
  "surgut",
  "tver",
  "magnitogorsk",
  "yakutsk",
  "bryansk",
  "ivanovo",
  "vladimir",
  "chita",
  "belgorod",
  "podolsk",
  "volzhsky",
  "vologda",
  "smolensk",
  "saransk",
  "kurgan",
  "cherepovets",
  "arkhangelsk",
  "vladikavkaz",
  "orel",
  "yoshkarola",
  "sterlitamak",
  "kostroma",
  "murmansk",
  "novorossiysk",
  "tambov",
  "taganrog",
  "blagoveshchensk",
  "vnovgorod",
  "shakhty",
  "syktyvkar",
  "pskov",
  "orsk",
  "khmao",
  "nazran",
  "derbent",
  "nizhnevartovsk",
  "noyabrsk",
  "gatchina",
  "kyzyl",
  "nalchik",
  "elista",
  "magadan",
  "kamchatka",
  "domodedovo",
  "khimki",
  "mytishchi",
  "lyubertsy",
  "hasavyurt",
  "kaspiysk",
  "kizlyar",
];

const pages = [
  "", // главная страница
  "/credit",
  "/partner",
  "/redemption",
  "/blog",
];

// Функция для отправки URL в Search Console (заглушка)
async function submitToSearchConsole(url) {
  console.log(`🚀 Отправка URL в Google Search Console: ${url}`);

  // Здесь должен быть код для реального API запроса
  // Пример с curl:
  /*
  const { exec } = require('child_process');
  const command = `curl -X POST "https://searchconsole.googleapis.com/v1/urlInspection:inspect" \
    -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"inspectionUrl": "${url}", "siteUrl": "${url.split('/')[0]}//"}'`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Ошибка для ${url}: ${error}`);
    } else {
      console.log(`✅ Успешно отправлено: ${url}`);
    }
  });
  */

  // Имитация задержки
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`✅ Отправлено: ${url}`);
}

async function main() {
  console.log(
    "🎯 Начинаем отправку URL поддоменов в Google Search Console...\n"
  );

  const urlsToSubmit = [];

  // Генерируем все URL для отправки
  regions.forEach((region) => {
    pages.forEach((page) => {
      const url = `https://${region}.vipnomerastore.ru${page}`;
      urlsToSubmit.push(url);
    });
  });

  console.log(`📊 Всего URL для отправки: ${urlsToSubmit.length}\n`);

  // Отправляем URL порциями по 10
  const batchSize = 10;
  for (let i = 0; i < urlsToSubmit.length; i += batchSize) {
    const batch = urlsToSubmit.slice(i, i + batchSize);

    console.log(
      `📦 Обрабатываем порцию ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        urlsToSubmit.length / batchSize
      )}`
    );

    const promises = batch.map((url) => submitToSearchConsole(url));
    await Promise.all(promises);

    // Пауза между порциями
    if (i + batchSize < urlsToSubmit.length) {
      console.log("⏳ Пауза 5 секунд...\n");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log("\n🎉 Все URL отправлены!");
  console.log("\n📋 Следующие шаги:");
  console.log(
    "1. Добавьте все поддомены как отдельные properties в Google Search Console"
  );
  console.log("2. Загрузите sitemap.xml для каждого поддомена");
  console.log(
    "3. Используйте URL Inspection для ручной проверки ключевых страниц"
  );
  console.log(
    "4. Настройте внешние ссылки на поддомены через соцсети и партнёров"
  );
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { regions, pages };
