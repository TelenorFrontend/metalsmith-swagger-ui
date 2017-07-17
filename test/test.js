const Metalsmith = require('metalsmith');
const expect = require('expect');
const plugin = require('./../index.js');
const fs = require('fs');
const path = require('path');

before((done) => {
  Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(plugin())
  .build((err) => {
    if (err) done(err);
    done();
  });
});

describe('metalsmith-swaggerui', ()=> {
  describe('#isOpenAPI',  () => {
    it('should match .json files',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'petstore.html'))).toBe(true);
    });

    it('should match .yaml files',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'petstore-simple.html'))).toBe(true);
    });

    it('should match .yml files',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'petstore-minimal.html'))).toBe(true);
    });

    it('should not match invalid Open API specs',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'json.html'))).toBe(false);
    });
  });

  describe('#processFiles',  () => {
    it('should copy assets to the appropriate directory',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'assets', 'swagger-ui', 'swagger-ui.js'))).toBe(true);
    });

    it('should leave source files in the build directory',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'petstore.json'))).toBe(true);
    });

    it('should leave other files untouched',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'json.json'))).toBe(true);
    });
  });

  describe('plugin options',  () => {
    before((done) => {
      Metalsmith(__dirname)
      .source('./src')
      .destination('./build')
      .clean(true)
      .use(plugin({
        destination: './customAssetFolder',
        layout: path.join(__dirname, 'assets', 'customLayout.js'),
        template: path.join(__dirname, 'assets', 'customTemplate.hbs'),
        defaultStylesheet: false,
        integrateAssets: false
      }))
      .build((err) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
    });

    it('should respect the destination option',  () => {
      expect(fs.existsSync(path.join(__dirname, 'build', 'customAssetFolder', 'swagger-ui.js'))).toBe(true);
    });

    it('should respect the layout option',  (done) => {
      fs.readFile(path.join(__dirname, 'build', 'customAssetFolder', 'swagger-ui-layout.js'), (err, data) => {
        if (err) throw done(err);
        expect(data.toString()).toMatch(/customLayout\.js/);
        done();
      });
    });

    it('should respect the template option',  (done) => {
      fs.readFile(path.join(__dirname, 'build', 'petstore.html'), (err, data) => {
        if (err) throw done(err);
        expect(data.toString()).toMatch(/Custom template!/);
        done();
      });
    });

    it('should respect the defaultStylesheet option',  (done) => {
      fs.readFile(path.join(__dirname, 'build', 'petstore.html'), (err, data) => {
        if (err) throw done(err);
        expect(data.toString()).toNotMatch(/swagger-ui\.css/);
        done();
      });
    });

    it('should respect the integrateAssets option',  (done) => {
      fs.readFile(path.join(__dirname, 'build', 'petstore.html'), (err, data) => {
        if (err) throw done(err);
        expect(data.toString()).toNotMatch(/swagger-ui-bundle\.js/);
        done();
      });
    });

  });
});
