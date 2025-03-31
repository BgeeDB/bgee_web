[![DOI](https://zenodo.org/badge/DOI/10.1093/nar/gkae1118.svg)](https://doi.org/10.1093/nar/gkae1118)
[![DOI](https://zenodo.org/badge/DOI/10.1093/nar/gkaa793.svg)](https://doi.org/10.1093/nar/gkaa793)
[![Bluesky](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpublic.api.bsky.app%2Fxrpc%2Fapp.bsky.actor.getProfile%2F%3Factor%3Dbgee.org&query=%24.followersCount&style=social&logo=bluesky&label=Follow%20%40bgee.org)](https://bsky.app/profile/bgee.org)
[![Mastodon](https://img.shields.io/mastodon/follow/109308703977124988?style=social&label=Follow%20%40bgeedb&domain=https%3A%2F%2Fgenomic.social)](https://genomic.social/%40bgeedb)

# Requirements

- NodeJS 16.x.x or fewer
- Yarn

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

The images are stored externally of the project.
You will find the path of the images in the config.json at the key `imageDomain`.
Be careful, the image used for the 'external icon' link is directly defined in the SCSS.
If you are moving it, don't forget to change the path.

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

## Getting Started

[📖 React Router docs](https://reactrouter.com/)

### Installation

Install the dependencies:

```bash
npm i
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```sh
npm start
```

## Deployment

### Docker Deployment

Build:

```bash
docker build -t bgee-web .
```

Run:

```sh
docker run -p 3000:3000 bgee-web
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Migration

https://reactrouter.com/6.30.0/upgrading/v5

https://reactrouter.com/upgrading/v6

File base routing: https://reactrouter.com/how-to/file-route-conventions

Rename `.js` to `.jsx` in folder:

```bash
find . -type f -name "*.js" -exec bash -c 'mv "$0" "${0%.js}.jsx"' {} \;
```

Need to remove all `defaultProps`, and use the default definition in the functions arguments

### TODO

In `public/index.html` there was these lines to import icons, we might want to do this properly by installing the dependency in the `package.json`:

```html
<script type="module" src="/js/ionicons-5.5.4/ionicons.esm.js"></script>
<script nomodule src="/js/ionicons-5.5.4/ionicons.js"></script>
```

