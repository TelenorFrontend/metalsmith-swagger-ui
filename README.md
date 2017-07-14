# metalsmith-swagger-ui

A [metalsmith](https://github.com/segmentio/metalsmith) plugin to embed [swagger-ui](https://github.com/swagger-api/swagger-ui) in place of Open API spec-files.

## Installation

    $ npm install --save https://github.com/TelenorFrontend/metalsmith-swagger-ui.git

## Javascript Usage

  Pass `options` to the plugin and pass it to Metalsmith with the `use` method:

```js
const swaggerui = require('metalsmith-swaggerui');

metalsmith.use(swaggerui({
  destination: './assets/swagger-ui',
  layout: path.join(__dirname, 'assets/layout-default.js'),
  template: path.join(__dirname, 'assets/template.hbs'),
  defaultStylesheet: true,
  integrateAssets: true,
}));
```

## Options

`destination`: Where the plugin will place the swagger-ui css- and js-files (relative to the build folder).

## License

  Apache-2.0
