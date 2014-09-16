/*global describe,it*/
'use strict';

var assert = require('assert');
var sm     = require('../lib/string-mutator.js');

describe('string-mutator', function() {
  describe('replace first match with ...', function() {  
    xit('replaces match', function() {
      var line = "var app = new EmberApp();"
      var firstObj = sm.content(line).first(/new EmberApp\(.*\);/)
      // console.log(firstObj);

      var replaced = firstObj.replaceWith('new EmberApp(HelloWorld)');
      // console.log(replaced);

      assert.equal( replaced.result, "var app = new EmberApp(HelloWorld)");
    });        
  }); 

  xdescribe('prepend before', function() {  
    it('prepends it', function() {
      var lines = "// along with the exports of each module as its value.\nmodule.exports = app.toTree();"
      var css_import = "app.import('bower_components/bootstrap/dist/css/bootstrap.css');\n";
      var bef = sm.content(lines).before('module.exports');
      console.log(bef);
      var prepended = bef.prependTxt(css_import).mergeRest();   
      console.log(prepended);
      var res = prepended.result;
      console.log(res);

      assert.equal( res, "var app = new EmberApp(HelloWorld)");
    });        
  }); 

  describe('prepend before', function() {  
    it('prepends it', function() {
      var lines = "// along with the exports of each module as its value.\nmodule.exports = app.toTree();"
      var css_import = "app.import('bower_components/bootstrap/dist/css/bootstrap.css');\n";
      var bef = sm.content(lines).last('module.exports').prepend(css_import);
      console.log(bef);
      var res = bef.result;
      console.log(res);

      assert.equal( res, "var app = new EmberApp(HelloWorld)");
    });        
  }); 

});    



