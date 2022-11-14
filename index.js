const PCSS_REGEX = /\.pcss$/;

/**
 * Check if two regexes are equal
 * Stolen from https://stackoverflow.com/questions/10776600/testing-for-equality-of-regular-expressions
 *
 * @param {RegExp} x
 * @param {RegExp} y
 * @returns {boolean}
 */
const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

/**
 * Copies Next CSS Webpack loaders to work with global .pcss files.
 * @example
 * ```js
 * const withTM = require('next-transpile-modules')(['some_package']);
 * const withPcss = require("@yakovlev-alexey/next-pcss");
 *
 * module.exports = withTm(withPcss({ /* your config here *\/ }))
 * ```
 * @param {import('next').NextConfig} nextConfig
 * @returns {import('next').NextConfig}
 */
const withPcss = (nextConfig) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const nextCssLoaders = config.module.rules.find(
        (rule) => typeof rule.oneOf === "object"
      );

      if (nextCssLoaders && !options.isServer) {
        // find the default CSS loader and copy it with a different test value
        const nextGlobalCssLoader = nextCssLoaders.oneOf.find(
          (rule) =>
            rule.sideEffects === true &&
            regexEqual(rule.test, /(?<!\.module)\.css$/)
        );

        if (nextGlobalCssLoader) {
          const globalPcssLoader = { ...nextGlobalCssLoader, test: PCSS_REGEX };
          nextCssLoaders.oneOf.push(globalPcssLoader);
        } else {
          console.warn(
            "could not find default CSS rule in client Webpack, global PCSS imports may not work"
          );
        }
      }

      if (nextCssLoaders && options.isServer) {
        // on the server non module CSS files are ignored and PCSS files should be too
        const nextGlobalCssIgnoreLoader = nextCssLoaders.oneOf.find((rule) =>
          Array.isArray(rule.test)
            ? rule.test.some((test) => regexEqual(test, /(?<!\.module)\.css$/))
            : regexEqual(rule.test, /(?<!\.module)\.css$/)
        );

        if (nextGlobalCssIgnoreLoader) {
          nextGlobalCssIgnoreLoader.test.push(PCSS_REGEX);
        } else {
          console.warn(
            "could not find default CSS ignore rule in server webpack, global PCSS imports may not work"
          );
        }
      }

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

module.exports = withPcss;
