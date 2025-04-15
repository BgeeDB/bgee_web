const splitWithOccurrences = (str, sub) => {
  const regExp = new RegExp(sub, 'gi');
  let match = str?.split(regExp) || [];
  let occ = RegExp.prototype[Symbol.matchAll].call(regExp, str);
  if (!occ) return [str];
  occ = Array.from(occ);
  match = [].concat(...match.map((e, i) => (occ[i] ? [e, { key: occ[i][1], text: occ[i][0] }] : [e])));
  return match;
};

export default splitWithOccurrences;
