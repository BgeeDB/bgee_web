const { loaderByName, addAfterLoader, removeLoaders } = require('@craco/craco');
const rawLoader = require('craco-raw-loader');

module.exports = {
  reactScriptsVersion: 'react-scripts',
  style: {
    css: {
      loaderOptions: () => ({ url: false }),
    },
  },
  webpack: {
    configure: (webpackConfig, { env }) => {
      const isEnvDevelopment = env === 'development';
      const isEnvProduction = env === 'production';
      const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
      removeLoaders(webpackConfig, loaderByName('resolve-url-loader'));

      const resolveUrlLoader = {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction ? shouldUseSourceMap : isEnvDevelopment,
        },
      };

      addAfterLoader(
        webpackConfig,
        loaderByName('postcss-loader'),
        resolveUrlLoader
      );

      return webpackConfig;
    },
  },
  plugins: [
    {
      plugin: rawLoader,
      options: {
        test: /\.md$/,
      },
    },
  ],
};
