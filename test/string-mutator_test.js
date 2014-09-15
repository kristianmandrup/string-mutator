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

    describe('prepend.to', function() {
      it('prepends $ before 8', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.first(/\d+/g).prepend('$').to(msg);

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

    describe('replace', function() {
      it('replace 15 with 42', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).replaceWith('42', msg);
        assert( res, "Peter has 8 dollars and Jane has 42");
      });    
    });

    describe('replace.on', function() {
      it('replace 15 with 42', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).replaceWith('42').on(msg);
        assert( res, "Peter has 8 dollars and Jane has 42");
      });    
    });

    describe('remove', function() {
      it('remove 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).remove(msg);
        assert( res, "Peter has 8 dollars and Jane has ");
      });    
    });

    describe('remove.on', function() {
      it('remove 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).remove().on(msg);
        assert( res, "Peter has 8 dollars and Jane has ");
      });    
    });
  });

  describe('content', function() {  
    describe('last.prepend', function() {
      it('prepend $ before 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.content(msg).last(/\d+/g).remove();
        assert( res, "Peter has 8 dollars and Jane has ");
      });    
    });

    describe('between', function() {
      it('replace last 15 between Peter and Paul with 20', function() {
        var msg = "Paul and Peter have 15 dollars, Jane has 15 and Paul has 15"
        var res = sm.content(msg).between(/Peter/).and(/Paul/).last(/\d+/g).replaceWith('20');

        // => Peter has 15 dollars, Jane has 20 and Paul has 32 or 15
        assert( res, "Peter has 15 dollars, Jane has 20 and Paul has 32 or 15");
      });    
    });

    describe('before', function() {
      it('replace last 15 before Paul with 20', function() {
        var msg = "Peter have 15 dollars, Jane has 15 and Paul has 15"
        var res = sm.content(msg).before(/Paul/).last(/\d+/g).replaceWith('20');

        // => Peter has 15 dollars, Jane has 20 and Paul has 32 or 15
        assert( res, "Peter has 15 dollars, Jane has 20 and Paul has 32 or 15");
      });    
    });

    describe('after', function() {
      it('replace last 15 before Paul with 20', function() {
        var msg = "Peter have 15 dollars, Jane has 1 and Paul has 2"
        var res = sm.content(msg).after(/Jane/).first(/\d/g).replaceWith('3');

        // => Peter has 15 dollars, Jane has 3 and Paul has 2
        assert( res, "Peter have 15 dollars, Jane has 3 and Paul has 2");
      });    
    });

  });
});
