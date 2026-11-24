import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  appDirectory: 'src',
  // Must start with Vite's `base` (see vite.config.ts).
  basename: process.env.ARCHIVE_BASE || '/',
} satisfies Config;
