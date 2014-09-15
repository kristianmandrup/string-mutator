/*global describe,it*/
'use strict';

var assert = require('assert');

var mutators = require('../lib/mutators');
var sm = mutators.sm;
var fm = mutators.fm;

describe('string-mutator', function() {
  describe('first', function() {  
    describe('prepend', function() {
      it('prepends $ before 8', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.first(/\d+/g).prepend('$', msg);

        assert( res, "Peter has $8 dollars and Jane has 15");
      });    
    });
  });
});

describe('file-mutator', function() {
  describe('readFile', function() {  
    describe('.content', function() {  
      it('prepends $ before 8', function() {
        var res = fm.readFile('test/files/test.txt').content;

        assert( res, "Peter has $8 dollars and Jane has 15");
      });        
    });    
  });
});
