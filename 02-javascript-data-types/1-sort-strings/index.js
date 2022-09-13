/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortedArr = [...arr];
  const sortParam = param === 'asc' ? 1 : -1;

  return sortedArr.sort((a, b) => sortParam * a.localeCompare(b, 'ru', { caseFirst: 'upper' }));
}