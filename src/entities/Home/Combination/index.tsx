import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";

import NumberSort from "./ui/NumberSorting";
import NumberList from "./ui/NumberList";
import Mask from "./ui/NumberMask";

import { SERVER_URL } from "@/shared/api";
import { CACHE_TIMES } from "@/shared/utils/cachedFetch";
import { NumberItem } from "@/store/cartStore";
import { useRegion } from "@/hooks/useRegion";
import styles from "./Combination.module.scss";

interface ExtendedNumberItem extends NumberItem {
  region: string[];
  description: string;
}

const ITEMS_PER_PAGE = 20;

const regionEndingsMap: Record<string, string[]> = {
  moscow: [
    "77",
    "97",
    "99",
    "177",
    "197",
    "199",
    "777",
    "797",
    "799",
    "977",
    "277",
    "299",
  ],
  saintPetersburg: ["78", "178", "198"],
  rostovOnDon: ["61", "161"],
  ekaterinburg: ["66", "96"],
  krasnodar: ["23", "93", "323"],
  makhachkala: ["05"],
  novosibirsk: ["54", "154"],
  nizhnyNovgorod: ["52", "152", "252"],
  tyumen: ["72", "172"],
  samara: ["63", "163"],
  kazan: ["16", "116"],
  sochi: ["23"],
  kaluga: ["40"],
  grozny: ["20", "95"],
  ufa: ["02", "102"],
  voronezh: ["36"],
  chelyabinsk: ["74", "174"],
  krasnoyarsk: ["24", "124"],
  omsk: ["55"],
  volgograd: ["34", "134"],
  orenburg: ["56"],
  perm: ["59", "159"],
  saratov: ["64"],
  togliatti: ["63"],
  barnaul: ["22"],
  izhevsk: ["18"],
  khabarovsk: ["27"],
  ulyanovsk: ["73"],
  irkutsk: ["38"],
  vladivostok: ["25", "125"],
  yaroslavl: ["76"],
  stavropol: ["26", "126"],
  sevastopol: ["92"],
  naberezhnyeChelny: ["16"],
  tomsk: ["70"],
  balashikha: ["50", "90", "150", "190", "750", "790"],
  kemerovo: ["42"],
  novokuznetsk: ["42"],
  ryazan: ["62"],
  cheboksary: ["21", "121"],
  kaliningrad: ["39", "91"],
  penza: ["58"],
  lipetsk: ["48"],
  kirov: ["43"],
  astrakhan: ["30"],
  tula: ["71"],
  ulanUde: ["03"],
  kursk: ["46"],
  surgut: ["86"],
  tver: ["69"],
  magnitogorsk: ["74"],
  yakutsk: ["14"],
  bryansk: ["32"],
  ivanovo: ["37"],
  vladimir: ["33"],
  chita: ["75", "80"],
  belgorod: ["31"],
  podolsk: ["50", "90"],
  volzhsky: ["34"],
  vologda: ["35"],
  smolensk: ["67"],
  saransk: ["13", "113"],
  kurgan: ["45"],
  cherepovets: ["35"],
  arkhangelsk: ["29"],
  vladikavkaz: ["15"],
  orel: ["57"],
  yoshkarOla: ["12"],
  sterlitamak: ["02", "102"],
  kostroma: ["44"],
  murmansk: ["51"],
  novorossiysk: ["23", "93"],
  tambov: ["68"],
  taganrog: ["61", "161"],
  blagoveshchensk: ["28"],
  velikyNovgorod: ["53"],
  shakhty: ["61", "161"],
  syktyvkar: ["11", "111"],
  pskov: ["60"],
  orsk: ["56"],
  khantyMansiysk: ["86", "186"],
  nazran: ["06"],
  derbent: ["05"],
  nizhnevartovsk: ["86", "186"],
  novyUrengoy: ["89"],
  gatchina: ["47"],
  kyzyl: ["17"],
  nalchik: ["07"],
  elista: ["08"],
  magadan: ["49"],
  petropavlovskKamchatsky: ["41"],
  domodedovo: ["50", "90"],
  khimki: ["50", "90"],
  mytishchi: ["50", "90"],
  lyubertsy: ["50", "90"],
  hasavyurt: ["05"],
  kaspiysk: ["05"],
  kizlyar: ["05"],
};

const HomeCombination = () => {
  const [allNumbers, setAllNumbers] = useState<ExtendedNumberItem[]>([]);
  const [tempNumbers, setTempNumbers] = useState<ExtendedNumberItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [draftNumber, setDraftNumber] = useState(() => {
    const arr = Array(10).fill("");
    arr[0] = "9";
    return arr;
  });
  const [draftPrice, setDraftPrice] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [draftActiveMaskTab, setDraftActiveMaskTab] = useState<0 | 1>(0);
  const [filterNumber, setFilterNumber] = useState(Array(10).fill(""));
  const [filterPrice, setFilterPrice] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [filterActiveMaskTab, setFilterActiveMaskTab] = useState<0 | 1>(0);
  const [operator, setOperator] = useState("Все операторы");
  const [birthNumber, setBirthNumber] = useState("Год рождения");
  const [bestNumber, setBestNumber] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("none");
  const [order, setOrder] = useState<"asc" | "desc" | "none">("none");
  const [paginationValue, setPaginationValue] = useState(1);
  const [selectedTier, setSelectedTier] = useState("all");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<NumberItem | null>(null);

  const { region } = useRegion();

  const numberListRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const params = useParams();
  const urlPhone = typeof params.phone === "string" ? params.phone : "";

  // Вспомогательная функция для обратного поиска последнего элемента
  const findLastIndexHelper = useCallback(
    (arr: string[], predicate: (item: string) => boolean) => {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) return i;
      }
      return -1;
    },
    []
  );

  // Функция для определения позиции ввода в маске
  const getInputPosition = useCallback(
    (criteria: string[]) => {
      const firstIndex = criteria.findIndex((c) => c !== "");
      const lastIndex = findLastIndexHelper(criteria, (c) => c !== "");
      return { first: firstIndex, last: lastIndex };
    },
    [findLastIndexHelper]
  );

  // Функция для создания паттерна из критериев
  const createPattern = useCallback((criteria: string[]) => {
    return criteria.filter((c) => c !== "").join("");
  }, []);

  // Функция для нормализации символов маски (поддержка русских и английских букв)
  const normalizeMaskSymbol = useCallback((symbol: string) => {
    return symbol.toUpperCase();
  }, []);

  // Функция для проверки, является ли символ буквой (английской или русской)
  const isLetter = useCallback((char: string) => {
    return /^[A-Z\u0410-\u042f]$/i.test(char);
  }, []);

  // Гибкая система скоринга для фильтрации
  const calculateMatchScore = useCallback(
    (phone: string, criteria: string[], isExact: boolean) => {
      const digits = phone.replace(/[\s+]/g, "").slice(-10);
      const pattern = createPattern(criteria);

      if (!pattern) return 0;

      if (isExact) {
        // Для точного поиска
        const { first, last } = getInputPosition(criteria);

        // Точное совпадение по позиции - максимальный приоритет
        const exactMatch = criteria.every(
          (char, i) => !char || digits[i] === char
        );
        if (exactMatch) return 1000 + pattern.length;

        // Если ввод в последних позициях - ищем окончания
        if (last >= 7) {
          if (digits.endsWith(pattern)) return 950 + pattern.length;

          // Ищем частичные совпадения в конце с уменьшающимся приоритетом
          for (let len = pattern.length - 1; len >= 1; len--) {
            const partialPattern = pattern.slice(-len);
            if (digits.endsWith(partialPattern)) {
              return 850 - (pattern.length - len) * 50 + len;
            }
          }
        }

        // Если ввод в первых позициях - ищем начала
        if (first <= 2) {
          const phoneStart = digits.slice(1); // Убираем код страны
          if (phoneStart.startsWith(pattern)) return 900 + pattern.length;

          // Частичные совпадения в начале
          for (let len = pattern.length - 1; len >= 1; len--) {
            const partialPattern = pattern.slice(0, len);
            if (phoneStart.startsWith(partialPattern)) {
              return 800 - (pattern.length - len) * 50 + len;
            }
          }
        }

        // Общий поиск подстроки как fallback
        if (digits.includes(pattern)) return 600;

        return 0;
      } else {
        // Для поиска по маске - улучшенная логика с поддержкой русских букв
        const letterToDigit = new Map<string, string>();
        const usedDigits = new Set<string>();

        for (let i = 0; i < 10; i++) {
          const m = criteria[i];
          const d = digits[i];
          if (!m) continue;

          // Нормализуем символ маски (приводим к верхнему регистру)
          const normalizedMask = normalizeMaskSymbol(m);

          if (letterToDigit.has(normalizedMask)) {
            if (letterToDigit.get(normalizedMask) !== d) return 0;
          } else {
            if (usedDigits.has(d)) return 0;
            letterToDigit.set(normalizedMask, d);
            usedDigits.add(d);
          }
        }

        // Дополнительные баллы за использование букв (поощряем сложные маски)
        const letterCount = criteria.filter((c) => c && isLetter(c)).length;
        return 1000 + pattern.length + letterCount * 10;
      }
    },
    [getInputPosition, createPattern, normalizeMaskSymbol, isLetter]
  );

  const matchesExact = useCallback((phone: string, criteria: string[]) => {
    const digits = phone.replace(/[\s+]/g, "").slice(-10);

    return criteria.every((char, i) => !char || digits[i] === char);
  }, []);

  const matchesMask = useCallback((phone: string, mask: string[]) => {
    const digits = phone.replace(/[\s+]/g, "").slice(-10);
    const letterToDigit = new Map<string, string>();
    const usedDigits = new Set<string>();

    for (let i = 0; i < 10; i++) {
      const m = mask[i];
      const d = digits[i];

      if (!m) continue;

      // Нормализуем символ маски (поддержка русских и английских букв)
      const normalizedMask = m.toUpperCase();

      if (letterToDigit.has(normalizedMask)) {
        if (letterToDigit.get(normalizedMask) !== d) return false;
      } else {
        if (usedDigits.has(d)) return false;

        letterToDigit.set(normalizedMask, d);
        usedDigits.add(d);
      }
    }
    return true;
  }, []);

  const matchesBirthNumber = useCallback((phone: string, birthNum: string) => {
    if (birthNum === "Год рождения") return true;

    const digits = phone.replace(/\D/g, "").slice(-10);

    const decade = birthNum.match(/\d{4}/)?.[0];

    if (!decade) return true;

    const startYear = parseInt(decade);

    for (let y = startYear; y < startYear + 10; y++) {
      if (digits.includes(y.toString())) return true;
    }

    return false;
  }, []);

  const matchesBestNumberCombined = useCallback(
    (phone: string, bestNums: string[]) => {
      if (!bestNums.length) return true;

      const digits = phone.replace(/\D/g, "");

      return bestNums.some((num) => num && digits.includes(num));
    },
    []
  );

  const filteredNumbers = useMemo(() => {
    let scored: (ExtendedNumberItem & { matchScore: number })[] = [];

    allNumbers.forEach((item) => {
      const priceMatch =
        item.price! >= filterPrice[0] && item.price! <= filterPrice[1];
      const operatorMatch =
        operator === "Все операторы" || item.operator === operator;
      const birthMatch = matchesBirthNumber(item.phone!, birthNumber);
      const bestNumMatch = matchesBestNumberCombined(item.phone!, bestNumber);

      if (!priceMatch || !operatorMatch || !birthMatch || !bestNumMatch) {
        return; // Исключаем номера, не прошедшие базовые фильтры
      }

      let matchScore = 0;

      if (filterNumber.some((n) => n !== "")) {
        matchScore = calculateMatchScore(
          item.phone!,
          filterNumber,
          filterActiveMaskTab === 0
        );

        // Если нет совпадений с фильтром по номеру, исключаем
        if (matchScore === 0) return;
      } else {
        // Если фильтр по номеру не активен, даем базовый балл
        matchScore = 500;
      }

      scored.push({ ...item, matchScore });
    });

    // Сортируем по релевантности (чем выше score, тем лучше)
    return scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(({ matchScore, ...item }) => item); // Убираем matchScore из результата
  }, [
    allNumbers,
    filterPrice,
    operator,
    birthNumber,
    bestNumber,
    filterNumber,
    filterActiveMaskTab,
    calculateMatchScore,
    matchesBirthNumber,
    matchesBestNumberCombined,
  ]);

  const sortedNumbers = useMemo(() => {
    const endings = regionEndingsMap[region] || [];

    // Приоритизируем по региону, но сохраняем порядок по релевантности
    let prioritizedNumbers = [...filteredNumbers];

    // Только если нет активной сортировки, применяем региональные приоритеты
    if (sortBy === "none" || order === "none") {
      prioritizedNumbers = prioritizedNumbers.sort((a, b) => {
        const aEndsWith = endings.some((end) =>
          a.phone?.replace(/\D/g, "").endsWith(end)
        );
        const bEndsWith = endings.some((end) =>
          b.phone?.replace(/\D/g, "").endsWith(end)
        );

        if (aEndsWith && !bEndsWith) return -1;
        if (!aEndsWith && bEndsWith) return 1;

        // fallback: регион приоритет
        const isAInRegion = a.region?.includes(region);
        const isBInRegion = b.region?.includes(region);

        if (isAInRegion && !isBInRegion) return -1;
        if (!isAInRegion && isBInRegion) return 1;

        return 0;
      });
    }

    // Применяем дополнительную сортировку, если она активна
    if (sortBy !== "none" && order !== "none") {
      return prioritizedNumbers.sort((a, b) => {
        if (sortBy === "price")
          return order === "asc" ? a.price! - b.price! : b.price! - a.price!;
        if (sortBy === "phone")
          return order === "asc"
            ? a.phone!.localeCompare(b.phone!)
            : b.phone!.localeCompare(a.phone!);
        return 0;
      });
    }

    return prioritizedNumbers;
  }, [filteredNumbers, sortBy, order, region]);

  const fetchFirst20Numbers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Кэшированный API запрос с revalidate 30 минут
      const res = await fetch(
        `${SERVER_URL}/katalog-nomerovs?pagination[page]=1&pagination[pageSize]=20`,
        {
          next: { revalidate: 1800 }, // 30 минут кэш
        }
      );
      const data = await res.json();

      const fetchedData = data.data.map((item: any) => ({
        id: item.documentId,
        phone: item.phone || item.number || "",
        price: item.price || 0,
        part_price: item.part_price || 0,
        operator: item.operator || "",
        partner_price: item.partner_price || 0,
        old_price: item.old_price,
        credit_month_count: item.credit_month_count || 0,
        currency: item.currency || "RUB",
        region: item.region || [],
        description: item.description || "",
      }));

      setTempNumbers(fetchedData);
    } catch (error: any) {
      console.log(error);
      setError("Failed to fetch the first 20 numbers.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRemainingNumbers = useCallback(async () => {
    setError(null);

    try {
      let allData: ExtendedNumberItem[] = [];
      let page = 2;
      const pageSize = 100;

      while (true) {
        const res = await fetch(
          `${SERVER_URL}/katalog-nomerovs?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
          {
            next: { revalidate: CACHE_TIMES.MEDIUM },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const resData = await res.json();

        const fetchedData = resData.data.map((item: any) => ({
          id: item.documentId,
          phone: item.phone || item.number || "",
          price: item.price || 0,
          part_price: item.part_price || 0,
          operator: item.operator || "",
          partner_price: item.partner_price || 0,
          old_price: item.old_price,
          credit_month_count: item.credit_month_count || 0,
          currency: item.currency || "RUB",
          region: item.region || [],
          description: item.description || "",
        }));

        allData.push(...fetchedData);

        const totalPages = Math.ceil(resData.meta.pagination.total / pageSize);

        if (page >= totalPages) break;

        page++;
      }

      setAllNumbers([...tempNumbers, ...allData]);
      setTempNumbers([]);

      if (allData.length) {
        const prices = allData.map((item) => item.price ?? 0);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        setMinPrice(min);
        setMaxPrice(max);
        setDraftPrice([min, max]);
      }
    } catch (error: any) {
      console.log(error);
      setError("Failed to fetch the remaining numbers.");
    }
  }, [tempNumbers]);

  useEffect(() => {
    fetchFirst20Numbers();
  }, [fetchFirst20Numbers]);

  useEffect(() => {
    if (tempNumbers.length > 0) {
      fetchRemainingNumbers();
    }
  }, [tempNumbers, fetchRemainingNumbers]);

  useEffect(() => {
    if (urlPhone && allNumbers.length) {
      const found = allNumbers.find(
        (item) => item.phone?.replace(/\D/g, "") === urlPhone.replace(/\D/g, "")
      );

      if (found) {
        setSelectedNumber(found);
        setShowDescriptionModal(true);
      }
    } else {
      setShowDescriptionModal(false);
      setSelectedNumber(null);
    }
  }, [urlPhone, allNumbers]);

  const handleApplyFilter = useCallback(() => {
    setFilterNumber(draftNumber);
    setFilterActiveMaskTab(draftActiveMaskTab);
    setFilterPrice(draftPrice);
    setPaginationValue(1);

    setTimeout(() => {
      if (numberListRef.current) {
        const top =
          numberListRef.current.getBoundingClientRect().top +
          window.pageYOffset -
          110;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 0);
  }, [draftNumber, draftPrice, draftActiveMaskTab]);

  const handleReset = () => {
    setDraftActiveMaskTab(0);
    setDraftPrice([minPrice, maxPrice]);
    setDraftNumber(() => {
      const arr = Array(10).fill("");
      arr[0] = "9";
      return arr;
    });
    setPaginationValue(1);
    setSortBy("none");
    setOrder("none");
    setFilterNumber(Array(10).fill(""));
    setOperator("Все операторы");
    setFilterPrice([minPrice, maxPrice]);
    setFilterActiveMaskTab(0);
    setBirthNumber("Год рождения");
  };

  const handlePaginationChange = (
    _: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPaginationValue(value);
  };

  const handleSortChange = (
    newSortBy: string,
    newOrder: "asc" | "desc" | "none"
  ) => {
    setSortBy(newSortBy);
    setOrder(newOrder);
  };

  const handleOpenDescription = useCallback(
    (item: NumberItem) => {
      setSelectedNumber(item);
      setShowDescriptionModal(true);
      router.push(`/${item.phone}`);
    },
    [router]
  );

  const handleCloseDescription = useCallback(() => {
    setShowDescriptionModal(false);
    setSelectedNumber(null);
    router.push("/");
  }, [router]);

  const handleTierSelect = useCallback((tier: string) => {
    setSelectedTier(tier);
    setPaginationValue(1);
  }, []);

  const numbersToDisplay = allNumbers.length > 0 ? sortedNumbers : tempNumbers;

  return (
    <div id="combination" className={styles.combinationWrapper}>
      <Mask
        activeMaskTab={draftActiveMaskTab}
        setActiveMaskTab={setDraftActiveMaskTab}
        number={draftNumber}
        setNumber={setDraftNumber}
        onApplyFilter={handleApplyFilter}
        bestNumber={bestNumber}
        setBestNumber={setBestNumber}
      />

      <NumberSort
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
        onReset={handleReset}
        numbers={sortedNumbers}
        operator={operator}
        setOperator={setOperator}
        birthNumber={birthNumber}
        setBirthNumber={setBirthNumber}
        region={region}
        selectedTier={selectedTier}
      />

      <div ref={numberListRef}>
        <NumberList
          sortBy={sortBy}
          order={order}
          onSortChange={handleSortChange}
          paginationValue={paginationValue}
          itemsPerPage={ITEMS_PER_PAGE}
          handlePaginationChange={handlePaginationChange}
          sortedNumbers={numbersToDisplay}
          loading={loading}
          error={error}
          showDescriptionModal={showDescriptionModal}
          setShowDescriptionModal={setShowDescriptionModal}
          selectedNumber={selectedNumber}
          setSelectedNumber={setSelectedNumber}
          onOpenDescription={handleOpenDescription}
          onCloseDescription={handleCloseDescription}
          selectedTier={selectedTier}
          onTierSelect={handleTierSelect}
          operator={operator}
          region={region}
          bestNumber={bestNumber}
          birthNumber={birthNumber}
          filterNumber={filterNumber}
          filterPrice={filterPrice}
          filterActiveMaskTab={filterActiveMaskTab}
        />
      </div>
    </div>
  );
};

export default HomeCombination;
