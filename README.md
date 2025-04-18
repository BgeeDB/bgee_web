[![DOI](https://zenodo.org/badge/DOI/10.1093/nar/gkae1118.svg)](https://doi.org/10.1093/nar/gkae1118)
[![DOI](https://zenodo.org/badge/DOI/10.1093/nar/gkaa793.svg)](https://doi.org/10.1093/nar/gkaa793)
[![Bluesky](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpublic.api.bsky.app%2Fxrpc%2Fapp.bsky.actor.getProfile%2F%3Factor%3Dbgee.org&query=%24.followersCount&style=social&logo=bluesky&label=Follow%20%40bgee.org)](https://bsky.app/profile/bgee.org)
[![Mastodon](https://img.shields.io/mastodon/follow/109308703977124988?style=social&label=Follow%20%40bgeedb&domain=https%3A%2F%2Fgenomic.social)](https://genomic.social/%40bgeedb)

# 🐝 Bgee website

[![Tests](https://github.com/vemonet/bgee_web/actions/workflows/test.yml/badge.svg)](https://github.com/vemonet/bgee_web/actions/workflows/test.yml)

Code for the Bgee website available at [https://www.bgee.org](https://www.bgee.org). Bgee is a database for retrieval and comparison of gene expression patterns across multiple animal species.

This website uses [React Router 7](https://reactrouter.com/home) to serve pages with server-side rendering (SSR).

## 🛠️ Development

### 📥 Installation

> Requirements: we recommend using the latest [NodeJS](https://nodejs.org/en/download) LTS (22+), but anything after 18 should work.

Install dependencies:

```bash
npm i
```

### 🔨 Development server

Start development server at http://localhost:5173:

```bash
npm run dev
```

### 🧹 Format, lint and check types

Format and lint with `prettier` and `eslint`:

```sh
npm run fmt
```

> [!NOTE]
>
> Formatting will be run automatically when you commit with `husky` and `lint-staged`.

Just lint:

```sh
npm run lint
```

Check types with TypeScript:

```sh
npm run typecheck
```

### ✅ Tests

Run the tests with [`playwright`](https://playwright.dev/):

```sh
npm test
```

### ⏫ Upgrade dependencies

Upgrade dependencies to their latest available version in the `package.json` file:

```sh
npm run upgrade
```

> [!WARNING]
>
> `bulma` breaks when upgraded to v1+, the rest can be usually upgraded without problem. It has been excluded from the upgrade script.

## 🌐 Deployment

### 📦 Build for production

Create a production build:

```bash
npm run build
```

Start the production server:

```sh
npm start
```

<details><summary>If you're familiar with deploying Node applications, the built-in app server is production-ready.</summary>

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/  # Static assets
│   └── server/  # Server-side code
```

</details>

Prepare the application to be deployed as an archive:

```shell
npm run archive
```

> [!IMPORTANT]
>
> Be careful with the version set in `config.json`, it will impact the app in production or in archive.

### 🐳 Docker deployment

Build:

```bash
docker build -t bgee-web .
```

Run:

```sh
docker run -p 3000:3000 bgee-web
```

## 💡 FAQ

### 📄 Add a new page

2 routing approaches are available:

- **[File-based routes](https://reactrouter.com/how-to/file-route-conventions)** in **`src/routes/`**
  - We recommend to use this approach for new pages
  - Currently used for all routes to markdown files, the gene items, and raw data pages
  - To add a route to `/gene/XYZ`:
    - Create a file named `gene.$geneId.tsx` (see example below)
    - Create a folder named `gene.$geneId` with a `route.tsx` file in it
- **[Manually defined routes](https://reactrouter.com/start/framework/routing)** in **`src/routes.ts`**
  - Currently used for most routes defined in `src/pages`
  - Link a URL path to a component file using the `route(path, file)` function

When creating a new route the file resolving this route can contain special exported functions used for SSR:

- **`loader`** function to preload data on the server (the served page will contain the html depending on the data from the loader, so really useful for SEO and load speed)
- **`meta`** function to define the page metadata (can use the data from `loader`)

> [!IMPORTANT]
>
> When creating new files **only create `.ts` or `.tsx` files**, they provide much more help and reliability than `.js` files.

Here is an example where we make multiple API calls in parallel in the `loader`, and use its results to define the page metadata and page content:

```tsx
import api from '~/api';
import config from '~/config.json';
import PATHS from '~/paths/paths';
import { geneToLdJSON } from '~/helpers/schemaDotOrg';
import { getMetadata } from '~/helpers/metadata';

export async function loader({ params, request }) {
  try {
    const [genesResp, speciesResp] = await Promise.all([
      api.search.genes.getGeneralInformation(params.geneId),
      api.search.species.name(params.speciesId),
    ]);
    return {
      genes: genesResp.data.genes,
      species: speciesResp.data.species,
      requestUrl: request.url,
    };
  } catch (error: any) {
    throw new Response(error.data?.message || error.message || 'Page not found', { status: 404 });
  }
}

export function meta({ data }) {
  return getMetadata({
    title: `${data.genes.name} expression in ${data.species.name}`,
    description: `Gene expression for ${data.genes.name} in ${data.species.name}`,
    keywords: `gene expression, ${data.genes.name}, ${data.species.name}`,
    link: data.requestUrl,
    schemaorg: [geneToLdJSON(data.genes)],
  });
}

export default function Page({ loaderData }) {
  const { genes, species } = loaderData;

  return <GeneDisplay genes={genes} species={species} />;
}
```

### 📃 Add a new markdown page

To add a markdown page you will need to create a new route in `src/routes/` with a `.tsx`/`.jsx` file, import the `.md`, and define the metadata in the route file, e.g.:

```tsx
import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/data-curation/data-curation.md';

export function meta() {
  return getMetadata({
    title: 'Bgee data curation tutorial',
    description: 'Bgee Tutorial about data curation and annotation',
    keywords: 'Tutorial, data curation, annotation',
  });
}

export default function Page() {
  return <Markdown />;
}
```

### 🖼️ Images and icons

The images are stored externally of the project. You will find the path of the images in the `src/config.json` file at the key `imageDomain`. Be careful, the image used for the 'external icon' link is directly defined in the SCSS. If you are moving it, don't forget to change the path.

If you need to add new icons you can find them there: https://lucide.dev/icons

```tsx
import { ChevronDown } from 'lucide-react';

<ChevronDown size={15} color="black" />;
```

### 📐 Font size matrix

```
$size-7: 12px;
$size-6: 1rem (= 14px)
$size-5: 1.1rem (= 15.4px)
$size-4: 1.2rem (= 16.8px)
$size-3: 1.5rem (= 21px)
```

## ☑️ To do

- [x] **Enable SSR** for most pages requiring it using `react-router` 7: gene, species, gene-list, experiments, home, gene expression calls.
  - [x] In `raw-data` we moved the search function out of `useLogic` to use it from the `loader` to have some basic SSR for experiments list. The loader passes its result to `useLogic` when a `speciesId` is detected alone to preload experiments links.
  - [x] Migrate from `react-markdown` to [`mdx`](https://mdxjs.com/) to render markdown (use same plugins and style)
  - [x] Migrate from `ion-icons` to [`lucide-react`](https://lucide.dev/) (ion-icons were not compatible with SSR, triggering hydration issues, plus how the icons were imported was not optimal)
- [x] **Migrate to TypeScript**: most main pages converted, some components too, tried to use proper types as much as possible
- [x] **CI/CD**: updated `eslint` rules, added basic tests of the website pages with [playwright](https://playwright.dev/), added automatic formatting and linting on commit with `husky` and `lint-staged`, added a GitHub action to run all tests automatically on push and PR.
- [ ] **Hydration issue in the `raw-data` page**, due to `react-select` using CSS-in-JS `emotion` library that is not compatible with SSR.
- [ ] **Upgrade `bulma`** dependency from 0.9 to 1+. We managed to make it compile in [this branch](https://github.com/vemonet/bgee_web/commit/4a2769b7951c9be9f53236978ff8d27516da269f), but still work to do to get the exact same style right (defaults are broken for many elements, and dark theme causes problems for those who have it enabled system-wide).
- [ ] **Fix script** `scripts/archiveCreation.js`.
- [ ] It would be nice to have have proper args and return types on `api` functions in `src/api/prod`
- [ ] Search for `TODO:` to fix in the code.

> Rename files `.js` to `.jsx` in folder and subfolders:
>
> ```bash
> find . -type f -name "*.js" -exec bash -c 'mv "$0" "${0%.js}.jsx"' {} \;
> ```
