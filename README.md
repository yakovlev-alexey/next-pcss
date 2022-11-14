# Next PCSS

Import global `.pcss` files in your Next.js project.

## Motiviation

If you are trying to migrate to Next.js some of your old build procedure may be a pain. For me this pain turned out to be a custom extension for global CSS files compiled with PostCSS. Renaming the files would break the old procedure which is not an option. This plugin adds necessary loaders to use such files in a Next project.

**How is this plugin different from [next-pcss](https://www.npmjs.com/package/next-pcss) package?**

`next-pcss` plugin by `yogin` is unmaintained and will not work with new versions of Next.js.

## Installation

```bash
yarn add -D @yakovlev-alexey/next-pcss
# or
npm install --save-dev @yakovlev-alexey/next-pcss
```

## Usage

This plugin is designed to be used with `next-transpile-modules` but can be used without it as well. Just wrap your Next.js configuration with `withPcss` call.

> If you are using `next-transpile-modules` then make sure to put `withPcss` **inside** `withTm` params. Otherwise copied PCSS loader will not be updated by `next-transpile-modules`.

```js
const withTM = require("next-transpile-modules")(["some_package"]);
const withPcss = require("@yakovlev-alexey/next-pcss");

module.exports = withTm(
  withPcss({
    /* your config here */
  })
);
```

> PCSS modules (`.module.pcss`) **will not** be compiled as CSS modules. Make sure to leave a [GitHub issue](https://github.com/yakovlev-alexey/next-pcss/issues) if you need this feature.

## License

[MIT](./LICENSE)
