import { visit } from 'unist-util-visit';

import { URL_ROOT } from './constants';

const rehypeLink = () => (tree) => {
  visit(tree, 'element', (node) => {
    const isInternal = /(^#)|(^\/)|(^https:\/\/www.bgee.org)/gi;
    if (node.tagName === 'a') {
      if (isInternal.test(node.properties.href)) {
        node.properties.classname = 'internal-link';
        const regex = /\/\/+/g;
        node.properties.href = node.properties.href
          .replace(/^\//, `${URL_ROOT}/`)
          .replace(/^https:\/\/www\.bgee\.org/, `${URL_ROOT}`)
          .replaceAll(regex, '/');
        // Add a data attribute to identify internal links that need client-side navigation in mdxComponents
        node.properties['data-internal-link'] = true;
      } else {
        node.properties.classname = 'external-link';
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
    }
  });
};

export default rehypeLink;
