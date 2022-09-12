/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param) {
  let sortedArr = [...arr];

  switch (param) {
  case 'asc':
    sortedArr.sort((a, b) => a.localeCompare(b, 'kf', { caseFirst: 'upper' }));
    break;
  case 'desc':
    sortedArr.sort((a, b) => b.localeCompare(a, 'kf', { caseFirst: 'upper' }));
    break;
  default:
    sortedArr.sort((a, b) => a.localeCompare(b, 'kf', { caseFirst: 'upper' }));
    break;
  }

  return sortedArr;
}