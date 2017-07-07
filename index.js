const fs = require('fs');
const path = require('path');
const merge = require('merge');
const async = require('async');
const readdir = require('recursive-readdir');
const handlebars = require('handlebars');
const swaggerUiPath = require('swagger-ui-dist').absolutePath();

const scripts = [];
const stylesheets = [];

/**
 * Default plugin options
 */
const defaults = {
  destination: './assets/swagger-ui',
  layout: path.join(__dirname, 'assets/layout-default.js'),
  template: path.join(__dirname, 'assets/template.hbs'),
  defaultStylesheet: true,
  integrateAssets: true,
};

/**
 * Check if a file is swagger-compliant
 * Todo: add yaml parsing and aditional validation
 */
function isOpenAPI(file) {
  return (/\.(json)$/.test(path.extname(file)));
}

/**
 * Process OpenAPI files by wrapping them in swagger-ui
 */
function processFiles(options, files, metalsmith, done) {
  const template = handlebars.compile(fs.readFileSync(metalsmith.path(options.template), 'utf8'));

  Object.keys(files).filter(isOpenAPI).forEach((file) => {
    const data = files[file];
    const html = path.format({
      dir: path.dirname(file),
      name: path.basename(file, path.extname(file)),
      ext: '.html',
    });

    data.swagger = {};
    data.swagger.integrateAssets = options.integrateAssets;
    data.scripts = []
      .concat(data.scripts)
      .concat(scripts)
      .filter(script => script !== undefined);

    if (options.defaultStylesheet) {
      data.stylesheets = []
        .concat(data.stylesheets)
        .concat(stylesheets)
        .filter(style => style !== undefined);
    }

    data.contents = new Buffer(template(data));
    delete files[file];

    files[html] = data;
  });

  done(null, true);
}

/**
 * Copy assets to the build folder and add stylesheets/scripts to the appropriate arrays
 * Mosty a line for line copy of https://github.com/treygriffith/metalsmith-assets
 */
function copyAssets(options, files, metalsmith, done) {
  /**
   * Read a file into  the metalsmith file structure
   */
  function read(file, name, callback) {
    fs.stat(file, (err) => {
      if (err) return callback(err);
      fs.readFile(file, (error, buffer) => {
        if (error) return callback(error);
        const data = {};

        data.contents = buffer;

        data.permalink = false; // don't let metalsmith-permalink change the folder structure
        files[name] = data;
        callback(error);
      });
    });
  }

  const src = metalsmith.path(swaggerUiPath);
  const dest = options.destination;

  // add the assets to the list of scripts/stylesheets
  stylesheets.push(`/${path.join(dest, 'swagger-ui.css')}`);
  scripts.push(`/${path.join(dest, 'swagger-ui-bundle.js')}`);
  scripts.push(`/${path.join(dest, 'swagger-ui-layout.js')}`);

  async.parallel([
    (callback) => { // copy the layout
      read(options.layout, path.join(dest, 'swagger-ui-layout.js'), callback);
    },
    (callback) => { // copy the swagger-ui files
      readdir(src, (err, files) => {
        if (err) return done(err);

        async.each(files, (file, finished) => {
          if (/\.(js|html|css)$/.test(path.extname(file))) {
            read(file, path.join(dest, path.relative(src, file)), finished);
          } else {
            finished();
          }
        }, (error) => {
          callback(error);
        });
      });
    }], (error) => {
    done(error);
  });
}

/**
 * Metalsmith plugin to parse OpenAPI specs with Swagger-Ui
 *
 * @param {Object} options (optional)
 *   @property {String} destination Path to copy static assets to
 *    (relative to destination directory).
 *   @property {String} layout The layout file to pass to swagger-ui
 *   @property {String} template Handlebars template
 *   @property {Boolean} defaultStylesheet Include the default swagger-ui stylesheet?
 *   @property {Boolean} integrateAssets Include the nessecary
 *    css/scripts on the default template?
 * @return {Function}
 */
module.exports = function (opt) {
  const options = merge({}, defaults, opt);

  return function (files, metalsmith, done) {
    async.parallel([
      (callback) => {
        copyAssets(options, files, metalsmith, callback);
      },
      (callback) => {
        processFiles(options, files, metalsmith, callback);
      },
    ], (error) => {
      done(error);
    });
  };
};
