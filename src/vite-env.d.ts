/**
 * TypeScript declarations for custom HTML elements used in the Bgee Web application
 */

declare module '*.md';

/**
 * Define types for Ionic Icons to properly work with TypeScript JSX
 */
declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': any;
    'sparql-editor': any;
  }
}

// Make sure React knows about custom elements
interface HTMLElementTagNameMap {
  'ion-icon': HTMLElement;
  'sparql-editor': HTMLElement;
}
