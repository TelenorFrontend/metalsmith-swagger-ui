const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

/**
 * Default plugin options
 */
const defaults = {
  template: path.join(__dirname, 'assets/template.hbs'),
};

/**
 * Check if a file is swagger-compliant
 * Todo: add yaml parsing and aditional validation
 */
function isOpenAPI(file) {
  return /\.(json|yml|yaml|openapi)$/.test(path.extname(file));
}

/**
 * Process OpenAPI files by wrapping them in swagger-ui
 */
function processFiles(options, files, metalsmith, done) {
  const template = handlebars.compile(fs.readFileSync(metalsmith.path(options.template), 'utf8'));

  Object.keys(files).filter(isOpenAPI).forEach((file) => {
    const data = Object.assign({}, files[file]);
    const html = path.format({
      dir: path.dirname(file),
      name: path.basename(file, path.extname(file)),
      ext: '.html',
    });

    if (!data.openApiUrl) {
      data.openApiUrl = path.basename(file);
    }

    data.contents = new Buffer(template(data));

    files[html] = data;

    if(/\.openapi$/.test(path.extname(file))) delete files[file];

  });

  done();
}

/**
 * Metalsmith plugin to parse OpenAPI specs with Swagger-Ui
 */
module.exports = (opt) => {
  const options = Object.assign({}, defaults, opt);

  return (files, metalsmith, done) => {
    processFiles(options, files, metalsmith, done);
  };
};
