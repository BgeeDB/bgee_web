declare module '*.md';

// Define types to properly work with TypeScript JSX
declare namespace JSX {
  interface IntrinsicElements {
    'sparql-editor': any;
  }
}

// Make sure React knows about custom elements
interface HTMLElementTagNameMap {
  'sparql-editor': HTMLElement;
}
