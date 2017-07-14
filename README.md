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
Defaults are shown in the example above, all options are optional.

## Options

`destination`: Where the plugin will place the swagger-ui css- and js-files (relative to the build folder).

`layout`: Which layout to pass to swagger-ui. For more info look in the `layout-default.js` file

`template`: A [handlebars](https://github.com/wycats/handlebars.js/) template that the plugin should use to generate the embed.

`integrateAssets`: If the default template is used this may be set to false if the plugin should not handle embeding the nessecary assets. If false, or you are using a custom template, make sure to read the section on including assets.

`defaultStylesheet`: If true the default swagger-ui stylesheet will be embedded on the page.

## Including assets
If a custom `template` is used, or `integrateAssets` is set to false you have to be sure to include stylesheets and js-files manually. This is usually favourable because it lets you include them in the appropriate places of your own layouts, and not in the middle of the page.

The plugin adds two ararys named `scripts` and `stylesheets` with links (relative to the build folder root) to the file metadata.

### Example include (with [handlebars](https://github.com/wycats/handlebars.js/)):
```html
{{#each stylesheets}}
  <link rel="stylesheet" type="text/css" href="{{ this }}" >
{{/each}}
{{#each scripts}}
  <script src="{{this}}"> </script>
{{/each}}
```

## License

  Apache-2.0
