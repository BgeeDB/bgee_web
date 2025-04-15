/**
 * TypeScript declarations for custom HTML elements used in the Bgee Web application
 */

declare module '*.md';

/**
 * Define types for Ionic Icons to properly work with TypeScript JSX
 */
declare namespace JSX {
  interface IntrinsicElements {
    'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      name?: string;
      size?: string;
      mode?: string;
      color?: string;
      [key: string]: any;
    };
  }
}

// Make sure React knows about custom elements
interface HTMLElementTagNameMap {
  'ion-icon': HTMLElement;
}
