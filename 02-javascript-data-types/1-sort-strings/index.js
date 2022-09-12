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
    sortedArr.sort((a, b) => a.localeCompare(b, 'ru', { caseFirst: 'upper' }));
    break;
  case 'desc':
    sortedArr.sort((a, b) => b.localeCompare(a, 'ru', { caseFirst: 'upper' }));
    break;
  default:
    sortedArr.sort((a, b) => a.localeCompare(b, 'ru', { caseFirst: 'upper' }));
    break;
  }

  return sortedArr;
}

// const data = [
//   'Соска (пустышка) NUK 10729357',
//   'ТВ тюнер D-COLOR  DC1301HD',
//   'Детский велосипед Lexus Trike Racer Trike',
//   'Соска (пустышка) Philips SCF182/12',
//   'Powerbank аккумулятор Hiper SP20000'
// ];
// sortStrings(data, asc);
// sortStrings(data, desc);

// {"description":"should correctly sort strings for mixed \"en\" and \"ru\" locales","success":false,"suite":["javascript-data-types/sort-strings"],"time":4}