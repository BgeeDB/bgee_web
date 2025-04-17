// const own = {}.hasOwnProperty;

// // TODO: REMOVE, not used anywhere

// /**
//  * Check if `node` has a set `name` property.
//  *
//  * @param {unknown} node
//  * @param {string} name
//  * @returns {boolean}
//  */
// const hasProperty = (node, name) => {
//   /** @type {unknown} */
//   const value =
//     name &&
//     node &&
//     typeof node === 'object' &&
//     // @ts-expect-error Looks like a node.
//     node.type === 'element' &&
//     // @ts-expect-error Looks like an element.
//     node.properties &&
//     // @ts-expect-error Looks like an element.
//     own.call(node.properties, name) &&
//     // @ts-expect-error Looks like an element.
//     node.properties[name];

//   return value !== null && value !== undefined && value !== false;
// };

// export default hasProperty;
