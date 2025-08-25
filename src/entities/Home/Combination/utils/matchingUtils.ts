/**
 * Hierarchical matching function that finds the longest consecutive match
 * starting from the end of the phone number pattern
 */
export const matchesExactHierarchy = (
  phone: string,
  criteria: string[]
): number => {
  const digits = phone.replace(/[\s+]/g, "").slice(-10);
  const lastIndex = criteria.reduce((acc, c, i) => (c ? i : acc), -1);

  if (lastIndex === -1) return 0;

  for (let len = lastIndex + 1; len >= 2; len--) {
    let matchCount = 0;

    for (let i = 0; i < len; i++) {
      const c = criteria[criteria.length - len + i];
      if (!c) continue;

      const digitIndex = digits.length - len + i;
      if (digits[digitIndex] === c) {
        matchCount++;
      } else {
        matchCount = -1;
        break;
      }
    }

    if (matchCount >= 2) return matchCount;
  }

  return 0;
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
