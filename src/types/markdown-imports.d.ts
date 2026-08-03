/**
 * TS `declare module '*.md'` matches only one path segment before `.md`.
 * Nested paths like `~/markdown/support/foo.md` need explicit patterns.
 */
declare module '~/*/*.md' {
  const MD: import('react').ComponentType<Record<string, unknown>>;
  export default MD;
}

declare module '~/*/*/*.md' {
  const MD: import('react').ComponentType<Record<string, unknown>>;
  export default MD;
}

declare module '~/*/*/*/*.md' {
  const MD: import('react').ComponentType<Record<string, unknown>>;
  export default MD;
}

declare module '~/*/*/*/*/*.md' {
  const MD: import('react').ComponentType<Record<string, unknown>>;
  export default MD;
}

declare module './tutorial-gene-page.md' {
  const MD: import('react').ComponentType<Record<string, unknown>>;
  export default MD;
}

declare module '*.md' {
  const MD: import('react').ComponentType<Record<string, unknown>>;
  export default MD;
}
