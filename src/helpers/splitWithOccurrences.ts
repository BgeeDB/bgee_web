const splitWithOccurrences = (str: string, sub: string) => {
  const regExp = new RegExp(sub, 'gi');
  let match: any = str?.split(regExp) || [];
  let occ: any = RegExp.prototype[Symbol.matchAll].call(regExp, str);
  if (!occ) return [str];
  occ = Array.from(occ);
  match = [].concat(...match.map((e, i) => (occ[i] ? [e, { key: occ[i][1], text: occ[i][0] }] : [e])));
  return match;
};

export default splitWithOccurrences;
