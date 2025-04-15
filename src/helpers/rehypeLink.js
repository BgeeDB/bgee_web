import { visit } from 'unist-util-visit';
import config from '../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}/` : '/'}`;

const rehypeLink = (navigate) => () => (tree) => {
  visit(tree, 'element', (node) => {
    const isInternal = /(^#)|(^\/)|(^https:\/\/www.bgee.org)/gi;
    if (node.tagName === 'a') {
      if (isInternal.test(node.properties.href)) {
        node.properties.classname = 'internal-link';
        const isInternalAndNotAnchor = /(^\/)|(^https:\/\/www.bgee.org)/gi;
        const regex = /\/\/+/g;
        node.properties.href = node.properties.href
          .replace(isInternalAndNotAnchor, `${URL_ROOT}`)
          .replaceAll(regex, '/');
        node.properties.onclick = (e) => {
          e.preventDefault();
          navigate(e.target.href.replace(window.location.origin, ''));
        };
      } else {
        node.properties.classname = 'external-link';
        node.properties.target = '_blank';
        node.properties.rel = 'noopener noreferrer';
      }
    }
  });
};

export default rehypeLink;
