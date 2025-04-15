[![DOI](https://zenodo.org/badge/DOI/10.1093/nar/gkae1118.svg)](https://doi.org/10.1093/nar/gkae1118)
[![DOI](https://zenodo.org/badge/DOI/10.1093/nar/gkaa793.svg)](https://doi.org/10.1093/nar/gkaa793)
[![Bluesky](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpublic.api.bsky.app%2Fxrpc%2Fapp.bsky.actor.getProfile%2F%3Factor%3Dbgee.org&query=%24.followersCount&style=social&logo=bluesky&label=Follow%20%40bgee.org)](https://bsky.app/profile/bgee.org)
[![Mastodon](https://img.shields.io/mastodon/follow/109308703977124988?style=social&label=Follow%20%40bgeedb&domain=https%3A%2F%2Fgenomic.social)](https://genomic.social/%40bgeedb)

# Requirements

- NodeJS 16.x.x or fewer
- Yarn

I get errors from TS for a lot of my components because I dont use all the params they defined (expecting they will get undefined).

Type '{ children: string; to: string; }' is missing the following properties from type '{ [x: string]: any; id: any; to: any; text: any; className: any; children: any; }': id, text, classNamets(2739)

How can I change the config to not have these messages (I dont want to have to fix everything one by one for now. so either disable some checks or create default type declarations for components at `src/components`)

# Installation

1. Have the tools asked in the requirements
2. At the root of the project, run the command:
````shell
yarn install
````
3. Run the project in dev with the following command:
````shell
yarn start
````

# Build

There are 2 commands to build the application.

````shell
yarn build
#or
yarn archive
````

The first command will build the app to be ready for production.
The second one will prepare the application to be deployed as an archive.

DO NOT FORGET
Be careful with the version set in config.json, it will impact the app in production or in archive.

# FAQ

### Where are the images?

The images are stored externally of the project. You will find the path of the images in the config.json at the key `imageDomain`. Be careful, the image used for the 'external icon' link is directly defined in the SCSS. If you are moving it, don't forget to change the path.

### Use of Node 17.x.x

Node 17.x.x doesn't work with create-react-app. So it will be impossible to build the app.
It's recommended to use NodeJS 16.x.x or fewer.

### Font size matrix

````
$size-7: 12px;
$size-6: 1rem (= 14px)
$size-5: 1.1rem (= 15.4px)
$size-4: 1.2rem (= 16.8px)
$size-3: 1.5rem (= 21px)
````

---

# 🐝 Bgee website 

Code for the Bgee website available at [https://www.bgee.org](https://www.bgee.org).

It uses [React Router 7](https://reactrouter.com/home) to serve the pages with server-side rendering (SSR).

## 💡 FAQ

### 📐 Font size matrix

````
$size-7: 12px;
$size-6: 1rem (= 14px)
$size-5: 1.1rem (= 15.4px)
$size-4: 1.2rem (= 16.8px)
$size-3: 1.5rem (= 21px)
````

### 🖼️ Where are the images?

The images are stored externally of the project. You will find the path of the images in the config.json at the key `imageDomain`. Be careful, the image used for the 'external icon' link is directly defined in the SCSS. If you are moving it, don't forget to change the path.

### 📄 Add a new page

2 routing approaches are available:

- [Manually defined routes](https://reactrouter.com/start/framework/routing) in `src/routes.ts`
  - Currently used for most routes defined in `src/pages`
  - Link a URL path to a component file using the `route(path, file)` function
- [File-based routes](https://reactrouter.com/how-to/file-route-conventions) in `src/routes/`
  - Used for routes to markdown files
  - We recommend to use this approach for new pages
  - To add a route to `/gene/XYZ`: 
    - Create a file named `gene.$geneId.tsx`
    - Create a folder named `gene.$geneId` with a `route.tsx` file in it

When creating a new route the file resolving this route can contain special exported functions used for SSR:

- `loader` function to preload data
- `meta` to define the page metadata (can use the data from `loader`)

```tsx
import config from '~/config.json';
import PATHS from '~/paths/paths';
import { geneToLdJSON } from '~/helpers/schemaDotOrg';
import { getMetadata } from '~/helpers/metadata';

export async function loader({ params, request }) {
  try {
     const [genesResp, speciesResp] = await Promise.all([
      api.search.genes.getGeneralInformation(params.geneId),
      api.search.species.name(params.speciesId)
    ]);
    return {
      genes: genesResp.data.genes,
      species: speciesResp.data.species,
			pathname: new URL(request.url).pathname,
    }
  } catch (error: any) {
    throw new Response(error.data?.message || error.message || 'Page not found', { status: 404 });
  }
}

export function meta({ data }) {
  return getMetadata({
    title: `${data.genes.name} expression in ${data.species.name}`,
    description: `Gene expression data for ${data.genes.name} in ${data.species.name}`,
    keywords: `gene expression, ${data.genes.name}, ${data.species.name}`,
    link: `${config.genericDomain}${PATHS.SEARCH.GENE_ITEM_BY_SPECIES.replace(':geneId', data.genes.id).replace(':speciesId', data.species.id)}`,
    schemaorg: [geneToLdJSON(data.genes)]
  });
}

export default function Page({ loaderData }) {
  const {genes, species} = loaderData;
  
  return <GeneDisplay genes={genes} species={species} />
}
```

### 📃 Add a new markdown page

To add a markdown page you will need to create a new route with a `.tsx`/`.jsx` file, import the `.md`, and define the metadata in the route file, e.g.:

```tsx
import { getMetadata } from '~/helpers/metadata';
import Markdown from '~/markdown/support/data-curation/data-curation.md'

export function meta()  {
  return getMetadata({
    title: 'Bgee data curation tutorial',
    description: 'Bgee Tutorial about data curation and annotation',
    keywords: 'Tutorial, data curation, annotation',
  })
};

export default function Page() {
  return <Markdown />;
}
```

## 🛠️ Development

### 📥 Installation

We recommend using the latest [NodeJS](https://nodejs.org/en/download) LTS (22+), but anything after 18 should work.

Install the dependencies:

```bash
npm i
```

### 🔨 Development server

Start the development server at `http://localhost:5173`:

```bash
npm run dev
```

### 🧹 Format and lint

```sh
npm run fmt
npm run lint
```

## 🌐 Deployment

### 📦 Build for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```sh
npm start
```

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/  # Static assets
│   └── server/  # Server-side code
```

Prepare the application to be deployed as an archive:

````shell
npm run archive
````

> [!IMPORTANT]
>
> Be careful with the version set in config.json, it will impact the app in production or in archive.

### 🐳 Docker Deployment

Build:

```bash
docker build -t bgee-web .
```

Run:

```sh
docker run -p 3000:3000 bgee-web
```

### ☑️ To do

- [x] https://reactrouter.com/6.30.0/upgrading/v5 / https://reactrouter.com/upgrading/v6

- [ ] In `public/index.html` there was these lines to import ion icons, it creates problem with SSR because they are web components and it's not well supported by SSR.

  ```html
  <script type="module" src="/js/ionicons-5.5.4/ionicons.esm.js"></script>
  <script nomodule src="/js/ionicons-5.5.4/ionicons.js"></script>
  ```

  A solution could be to migrate to their "react" approach: https://ionicframework.com/docs/api/icon 

- [ ] Issues with hydration in `raw-data` sometimes, due to `react-select` using CSS-in-JS `emotion` library that is not compatible with SSR.

- [ ] In `raw-data` migrate the search function out of `useLogic` to use it from `loader` (and pass its result to `useLogic`) to have SSR for experiments list.

> Rename `.js` to `.jsx` in folder:
>
> ```bash
> find . -type f -name "*.js" -exec bash -c 'mv "$0" "${0%.js}.jsx"' {} \;
> ```
