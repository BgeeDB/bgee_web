import type { Config } from '@react-router/dev/config';

export default {
  ssr: true,
  appDirectory: 'src',
  // Must start with Vite's `base` (see vite.config.ts).
  basename: process.env.ARCHIVE_BASE || '/',
  // Archives are built straight into ./archives/<version>-archived (set by scripts/archiveCreation.cjs),
  // because react-router-serve looks for JS/CSS in this path, resolved from the directory it is started in.
  buildDirectory: process.env.BUILD_DIR || 'build',
} satisfies Config;
