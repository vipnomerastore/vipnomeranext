import { NumberItem } from "@/store/cartStore";

/**
 * Hierarchical matching function that finds the longest consecutive match
 * starting from the beginning of the phone number pattern for Russian numbers
 */
export const matchesExactHierarchy = (
  phone: string,
  criteria: string[]
): number => {
  // Получаем только цифры номера без +7
  const digits = phone.replace(/\D/g, "");
  // Для российских номеров берем 10 цифр после +7
  const phoneDigits = digits.slice(-10);

  let matchCount = 0;

  // Проверяем совпадения с начала номера
  for (let i = 0; i < criteria.length && i < phoneDigits.length; i++) {
    const criteriaDigit = criteria[i];
    const phoneDigit = phoneDigits[i];

    if (criteriaDigit && criteriaDigit === phoneDigit) {
      matchCount++;
    } else if (criteriaDigit) {
      // Если есть критерий, но он не совпадает, прерываем поиск
      break;
    }
  }

  return matchCount;
};

/**
 * Finds the best matching numbers with hierarchical fallback
 * If no exact matches found, gradually reduces requirements
 */
export const findBestMatches = (
  allNumbers: NumberItem[],
  criteria: string[]
): NumberItem[] => {
  const nonEmptyCriteriaLength = criteria.filter(Boolean).length;

  if (nonEmptyCriteriaLength === 0) {
    return allNumbers;
  }

  // Сначала ищем точные совпадения
  let results = allNumbers.filter((item) => {
    const matchLength = matchesExactHierarchy(item.phone!, criteria);
    return matchLength === nonEmptyCriteriaLength;
  });

  // Если точных совпадений нет, ищем с постепенным уменьшением требований
  if (results.length === 0) {
    for (
      let requiredMatches = nonEmptyCriteriaLength - 1;
      requiredMatches >= 1;
      requiredMatches--
    ) {
      results = allNumbers.filter((item) => {
        const matchLength = matchesExactHierarchy(item.phone!, criteria);
        return matchLength >= requiredMatches;
      });

      // Если нашли совпадения, останавливаемся
      if (results.length > 0) {
        break;
      }
    }
  }

  return results;
};

/**
 * Mask matching function for pattern-based search
 */
export const matchesMask = (phone: string, mask: string[]): boolean => {
  const digits = phone.replace(/[\s+]/g, "").slice(-10);
  const letterToDigit = new Map<string, string>();
  const usedDigits = new Set<string>();

  for (let i = 0; i < 10; i++) {
    const m = mask[i];
    const d = digits[i];

    if (!m) continue;

    if (letterToDigit.has(m)) {
      if (letterToDigit.get(m) !== d) return false;
    } else {
      if (usedDigits.has(d)) return false;
      letterToDigit.set(m, d);
      usedDigits.add(d);
    }
  }
  return true;
};

/**
 * Birth year matching function
 */
export const matchesBirthNumber = (
  phone: string,
  birthNum: string
): boolean => {
  if (birthNum === "Год рождения") return true;

  const digits = phone.replace(/\D/g, "").slice(-10);
  const decade = birthNum.match(/\d{4}/)?.[0];

  if (!decade) return true;

  const startYear = parseInt(decade);
  for (let y = startYear; y < startYear + 10; y++) {
    if (digits.includes(y.toString())) return true;
  }

  return false;
};

/**
 * Best numbers matching function
 */
export const matchesBestNumberCombined = (
  phone: string,
  bestNums: string[]
): boolean => {
  if (!bestNums.length) return true;

  const digits = phone.replace(/\D/g, "");
  return bestNums.some((num) => num && digits.includes(num));
};
