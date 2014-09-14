/*global describe,it*/
'use strict';

var assert = require('assert');
var sm = require('../lib/string-mutator.js');

describe('string-mutator', function() {
  describe('first', function() {  
    describe('prepend', function() {
      it('prepends $ before 8', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.first(/\d+/g).prepend('$', msg);

        assert( res, "Peter has $8 dollars and Jane has 15");
      });    
    });

    describe('append', function() {
      it('appends $ after 8', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.first(/\d+/g).append('$', msg);
        assert( res, "Peter has 8$ dollars and Jane has 15");
      });    
    });
  });

  describe('last', function() {  
    describe('prepend', function() {
      it('prepends $ before 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.last(/\d+/g).prepend('$', msg);

        assert( res, "Peter has 8 dollars and Jane has $15");
      });    
    });

    describe('append', function() {
      it('appends $ after 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).append('$', msg);
        assert( res, "Peter has 8 dollars and Jane has 15$");
      });    
    });
  });
});
