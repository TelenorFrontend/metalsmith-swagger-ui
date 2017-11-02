# metalsmith-swagger-ui

A [Metalsmith](https://github.com/segmentio/metalsmith) plugin to embed [Swagger UI](https://github.com/swagger-api/swagger-ui) in place of Open API spec files.

## Installation

    $ npm install --save @telenor-frontend/metalsmith-swagger-ui

## Javascript Usage

Pass options to the plugin and pass it to Metalsmith with the `use` method:

```js
const swaggerui = require('metalsmith-swagger-ui');

metalsmith.use(swaggerui({
  template: path.join(__dirname, 'assets/template.hbs'),
}));
```
Defaults are shown in the example above, all options are optional.

## Options

`template`: A [handlebars](https://github.com/wycats/handlebars.js/) template that the plugin should use to generate the embed.

## Including assets

Make sure to include all the necessary assets (`swagger-ui.css`, `swagger-ui-bundle.js`, `swagger-ui-standalone-preset.js`) on the page where Swagger UI will be embedded.

The necessary assets can be obtained from the `swagger-ui-dist` package.

## Configuration

You can modify the look and feel of metalsmith-swagger-ui by passing a custom handlebars template in the options, overriding/rewriting the Swagger UI css style, or by using a different Swagger UI layout.

## License

Apache-2.0
