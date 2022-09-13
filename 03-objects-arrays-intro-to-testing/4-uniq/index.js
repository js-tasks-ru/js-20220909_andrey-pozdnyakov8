/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
  const uniqueElems = [...new Set(arr)];
  console.log(uniqueElems);
  return uniqueElems;
}

uniq(1, 'a', 'a', 2, 2);
