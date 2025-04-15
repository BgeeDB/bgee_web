### Project structure

```
    / docs

    / public

    / src

        / assets
    Provides all the assets needed as a dictionnary object

        / components

        / helpers
    Logical functions

        / hooks
    Custom React hooks

        / i18n
    Lightweight internationalization controller

        / pages
    Page components used by the routes

        / routes
    Routing handlers (route definition, paths dictionnary, ...)

        / static
    JS and JSON objects to render static html contents, using the staticBuilder (/src/helpers/staticBuilder.js)

        / styles
    SCSS and CSS style files

```

### Libraries used

- CRACO

Create React App Configuration Override is an easy and comprehensible configuration layer for create-react-app.
We are using CRACO because all the images assets should be in the public directory. (we override the webpack public that resolves the image path)
[Apache license] (https://github.com/gsoft-inc/gsoft-license/blob/master/LICENSE)

- Axios

Promised based HTTP client
[MIT license] (https://github.com/axios/axios/blob/master/LICENSE)

- Bulma

CSS Framework, highly customizable and modularizable.
Is very lightweight as well as simple to customize.
[MIT license] (https://opensource.org/licenses/mit-license.php)

- dlv

Safely get a dot-notated path within a nested object, with ability to return a
default if the full key path does not exist or the value is undefined
Very lightweight implementation
[MIT license] (https://oss.ninja/mit/developit/)

- React-Helmet

React-Helmet will manage all of your changes to the document head.
[MIT license] (https://github.com/nfl/react-helmet/blob/master/LICENSE)

- React-Router

React routing library
[MIT license] (https://github.com/remix-run/react-router/blob/main/LICENSE)

- react-select

React select allow a lot of features with select box [MIT Licensed] (https://react-select.com/home)

### Styles

- node-sass

Library that provides binding for Node.js to LibSass.
It will natively compile .scss to css automatically.

- sass-loader:

Webpack loader that compile Sass/SCSS to CSS

### Best Practices

- Eslint

Performs automated scans of your JavaScript files for common syntax and style errors.

- Prettier

Scans files for style issues and automatically reformats the code to ensure
consistent rules are being followed on the project.
