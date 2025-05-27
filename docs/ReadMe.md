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

- [Axios](https://axios-http.com/)

Promised based HTTP client [MIT license](https://github.com/axios/axios/blob/master/LICENSE)

- [Bulma](https://bulma.io/)

CSS Framework, highly customizable and modularizable. Is very lightweight as well as simple to customize. [MIT license](https://opensource.org/licenses/mit-license.php)

- [React Router](https://reactrouter.com/home)

React routing library [MIT license](https://github.com/remix-run/react-router/blob/main/LICENSE)

- [react-select](https://react-select.com/home)

React select allow a lot of features with select box [MIT License](https://github.com/JedWatson/react-select/blob/master/LICENSE)

- [vite](https://vite.dev)

Modern build tool for JS projects: dev server and build for production

### Styles

- sass

Library that provides binding for Node.js to LibSass. It will natively compile .scss to css automatically.

- sass-loader:

Webpack loader that compile Sass/SCSS to CSS

### Best Practices

- Eslint

Performs automated scans of your JavaScript files for common syntax and style errors.

- Prettier

Scans files for style issues and automatically reformats the code to ensure
consistent rules are being followed on the project.
