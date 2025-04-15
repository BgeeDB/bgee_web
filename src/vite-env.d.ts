/**
 * TypeScript declarations for custom HTML elements used in the Bgee Web application
 */

declare module "*.md";

declare namespace JSX {
  interface IntrinsicElements {
    // Ionic icon component
    'ion-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      name?: string;
      size?: string;
      mode?: string;
      color?: string;
    };

    // Add any other custom elements you might be using
    // For example:
    // 'custom-element': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
