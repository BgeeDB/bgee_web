const isPlural = (str: string, quantity: number) =>
  str + (quantity > 1 && str.charAt(str.length - 1) !== 's' ? 's' : '');

export default isPlural;
