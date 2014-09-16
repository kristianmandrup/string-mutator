/*global describe,it*/
'use strict';

var assert = require('assert');
var sm     = require('../lib/string-mutator.js');

describe('string-mutator', function() {
  describe('replace first match with ...', function() {  
    it('replaces match', function() {
      var line = "var app = new EmberApp();"
      var firstObj = sm.content(line).first(/new EmberApp\(.*\);/)
      console.log(firstObj);

      var replaced = firstObj.replaceWith('new EmberApp(HelloWorld)');
      console.log(replaced);

      assert.equal( replaced.result, "var app = new EmberApp(HelloWorld)");
    });        
  });    
});    



