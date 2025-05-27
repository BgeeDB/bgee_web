/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} Array to split
 * @param chunkSize {Number} Size of every group
 * @param customOpts {Object|undefined} options to apply
 *        fillChunk {boolean} will fill the last chunk to match the chunk size
 *        defaultItemFactory {function} will generate an item to fill the chunk
 */
const chunkArray = (arr: any[], chunkSize: number, customOpt: any = {}) => {
  const options = {
    fillChunk: false,
    defaultItemFactory: undefined,
    ...customOpt,
  };
  const results: any[] = [];
  const tmp = JSON.parse(JSON.stringify(arr));

  while (tmp.length) {
    results.push(tmp.splice(0, chunkSize));
  }

  if (options.fillChunk) {
    while (results[results.length - 1].length < chunkSize) {
      let defaultItem;
      if (options.defaultItemFactory) {
        defaultItem = options.defaultItemFactory();
      }
      results[results.length - 1].push(defaultItem);
    }
  }

  return results;
};
const equalsIgnoreOrder = (a, b) => {
  if (a.length !== b.length) return false;
  const uniqueValues = new Set([...a, ...b]);

  for (const v of uniqueValues) {
    const aCount = a.filter((e) => e === v).length;
    const bCount = b.filter((e) => e === v).length;
    if (aCount !== bCount) return false;
  }
  return true;
};

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

const arrayHelper = {
  chunked: chunkArray,
  equals: equalsIgnoreOrder,
};

export default arrayHelper;
