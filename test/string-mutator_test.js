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

        console.log('first prepend', res, ' -> Peter has $8 dollars and Jane has 15');
        // Peter has $8 dollars and Jane has 15

        assert( res, "Peter has $8 dollars and Jane has 15");
      });    
    });

    describe('prepend.to', function() {
      it('prepends $ before 8', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.first(/\d+/g).prepend('$').to(msg);

        console.log('first prepend to', res, ' -> Peter has $8 dollars and Jane has 15');
        // Peter has $8 dollars and Jane has 15
        assert( res, "Peter has $8 dollars and Jane has 15");
      });    
    });

    describe('append', function() {
      it('appends $ after 8', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.first(/\d+/g).append('$', msg);

        console.log('first append', res, ' -> Peter has 8$ dollars and Jane has 15');
        // Peter has 8$ dollars and Jane has 15
        assert( res, "Peter has 8$ dollars and Jane has 15");
      });    
    });
  });

  describe('last', function() {  
    describe('prepend', function() {
      it('prepends $ before 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15"
        var res = sm.last(/\d+/g).prepend('$', msg);

        console.log('last prepend', res, ' -> Peter has 8 dollars and Jane has 15$');
        // Peter has 8 dollars and Jane has 15$
        assert( res, "Peter has 8 dollars and Jane has $15");
      });    
    });

    describe('append', function() {
      it('appends $ after 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).append('$', msg);
        
        console.log('last append', res, ' -> Peter has 8 dollars and Jane has 15$');
        // Peter has 8 dollars and Jane has 15$
        assert( res, "Peter has 8 dollars and Jane has 15$");
      });    
    });

    describe('replace', function() {
      it('replace 15 with 42', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).replaceWith('42', msg);

        console.log('replace', res, '-> Peter has 8 dollars and Jane has 42');
        // Peter has 8 dollars and Jane has 42
        assert( res, "Peter has 8 dollars and Jane has 42");
      });    
    });

    describe('replace.on', function() {
      it('replace 15 with 42', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).replaceWith('42').on(msg);

        console.log('replace.on', res);
        // Peter has 8 dollars and Jane has 42
        assert( res, "Peter has 8 dollars and Jane has 42");
      });    
    });

    describe('remove', function() {
      it('remove 15', function() {
        var msg = "Peter has 8 dollars and Julie has 15$"
        var res = sm.last(/\d+/g).remove(msg);

        console.log('remove', res);
        // Peter has 8 dollars and Julie has $
        assert( res, "Peter has 8 dollars and Julie has $");
      });    
    });

    describe('remove.on', function() {
      it('remove 15', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.last(/\d+/g).remove().on(msg);

        console.log('remove.on', res);
        // Peter has 8 dollars and Jane has $

        assert( res, "Peter has 8 dollars and Jane has $");
      });    
    });
  });

  describe('content', function() {  
    describe('last remove', function() {
      it('remove last number', function() {
        var msg = "Peter has 8 dollars and Jane has 15$"
        var res = sm.content(msg).last(/\d+/g).remove();

        console.log('content.last remove', res);

        assert( res, "Peter has 8 dollars and Jane has ");
      });    
    });

    describe('between', function() {
      it('replace last 15 between Peter and Paul with 20', function() {
        var msg = "Paul and Peter have 15 dollars, Jane has 15 and Paul has 15"
        var res = sm.content(msg).between(/Peter/).and(/Paul/).last(/\d+/g).replaceWith('20');

        console.log('between', res);
        // => Peter has 15 dollars, Jane has 20 and Paul has 32 or 15
        assert( res, "Peter has 15 dollars, Jane has 20 and Paul has 32 or 15");
      });    
    });

    describe('before', function() {
      it('replace last 15 before Paul with 20', function() {
        var msg = "Peter have 15 dollars, Jane has 15 and Paul has 15"
        var res = sm.content(msg).before(/Paul/).last(/\d+/g).replaceWith('20');

        console.log('before', res);
        // => Peter has 15 dollars, Jane has 20 and Paul has 32 or 15
        assert( res, "Peter has 15 dollars, Jane has 20 and Paul has 32 or 15");
      });    
    });

    describe('after', function() {
      it('replace last 15 before Paul with 20', function() {
        var msg = "Peter have 15 dollars, Jane has 1 and Paul has 2"
        var res = sm.content(msg).after(/Jane/).first(/\d/g).replaceWith('3');

        console.log('after', res);
        // => Peter has 15 dollars, Jane has 3 and Paul has 2
        assert( res, "Peter have 15 dollars, Jane has 3 and Paul has 2");
      });    
    });

    describe('appendTxt', function() {
      it('append with: Tina has 7', function() {
        var msg = "Peter have 15 dollars"
        var res = sm.content(msg).appendTxt('Tina has 7').after(/Tina/).first(/\d/g).replaceWith('12');

        console.log('appendTxt', res);
        // => Peter has 15 dollars, Tina has 12
        assert( res, "Peter have 15 dollars, Tina has 12");
      });    
    });

    describe('prependTxt', function() {
      it('prepend with: Tina has 10', function() {
        var msg = "Peter have 15 dollars, Paul"
        var res = sm.content(msg).before(/Paul/).prependTxt('Tina has 7').first(/\d/g).replaceWith('12');

        console.log('prependTxt', res);
        // => Peter have 12 dollars, Tina has 7, Paul
        assert( res, "Peter have 12 dollars, Tina has 7, Paul");
      });    
    });

  });
});
