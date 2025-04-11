// import * as crypto from 'crypto';

// Import Node.js crypto module only in Node.js environment

const random = () => {
  // TODO: let crypto;
  // return crypto.randomBytes(4).readUInt32LE(0);
  return Math.floor(Math.random() * 4294967296);
  // if (typeof window !== 'undefined') {
  //   // crypto = window.crypto || window.msCrypto;
  //   const array = new Uint32Array(1);
  //   return crypto.getRandomValues(array)[0]; // Compliant for security-sensitive use cases
  // } else {
  //   // Use Node.js crypto module for SSR
  //   try {
  //     // const nodeCrypto = await import('crypto');
  //     return crypto.randomBytes(4).readUInt32LE(0);
  //   } catch (error) {
  //     console.warn('Crypto import error:', error);
  //     // Fallback if import fails
  //     return Math.floor(Math.random() * 4294967296);
  //   }
  // }
};

export default random;


// const random = () => {
//   const crypto = window.crypto || window.msCrypto;
//   const array = new Uint32Array(1);
//   return crypto.getRandomValues(array)[0]; // Compliant for security-sensitive use cases
// };

// export default random;
