/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  const arr = Array.from(string);
  let count = 1;

  if (size === 0) {
    return '';
  }

  if (!size || string === '') {
    return string;
  }

  const trimChars = arr.reduce((acc, current) => {
    const lastChar = acc[acc.length - 1];

    if (current === lastChar) {
      if (count !== size) {
        count += 1;
        const res = acc + current;

        return res;
      }

      return acc;
    } else if (current !== lastChar) {
      count = 1;
      const res = acc + current;

      return res;
    }
  }, arr[0]);

  return trimChars;
}