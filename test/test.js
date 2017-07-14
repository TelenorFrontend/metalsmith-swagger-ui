const Metalsmith = require('metalsmith');
const chai = require('chai');
const plugin = require('./../index.js');

describe('plugin', function() {
  describe('#isOpenAPI', function() {
    it('should match json files', function() {
      Metalsmith(__dirname)
      .source('./assets')
      .build((err) => {
        if (err) throw err;
        console.log(13);
        done();
      });

    });
  });
});