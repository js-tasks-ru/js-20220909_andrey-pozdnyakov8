/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (obj === undefined) {
    return;
  }
  const objEntries = Object.entries(obj);
  const mappedArr = objEntries.map(([key, value]) => [value, key]);

  const swapObj = Object.fromEntries(mappedArr);
  return swapObj;
}