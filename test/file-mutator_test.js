/*global describe,it*/
'use strict';

var assert = require('assert');
var fm     = require('../lib/file-mutator.js');

describe('file-mutator', function() {
  describe('readFile', function() {  
    describe('.content', function() {  
      it('reads content from file', function() {
        var res = fm.readFile('test/files/test.txt').content;

        assert.equal( res, "Peter has 8 dollars and Jane has 15");
      });        
    });    

    describe('.perform', function() {  
      it('prepends $ before 8', function() {
        var wasRead = fm.readFile('test/files/test.txt')
        var res = wasRead.perform(function() {
            return this.first(/\d+/).prepend('$');
          }).write();

        var written = res.read();
        // console.log('wrote', written);
        // console.log('rewrite original', wasRead.content);
        res.write(wasRead.content)
        assert.equal( written, "Peter has $8 dollars and Jane has 15");
      });        
    });    
  });    
});    
