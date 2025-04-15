const isPlural = (str, quantity) => str + (quantity > 1 && str.charAt(str.length - 1) !== 's' ? 's' : '');

export default isPlural;
