import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'sparql-editor': any;
      'ion-icon': any;
    }
  }
}

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'sparql-editor': any;
      'ion-icon': any;
    }
  }
}

interface HTMLElementTagNameMap {
  'sparql-editor': HTMLElement;
  'ion-icon': HTMLElement;
}
