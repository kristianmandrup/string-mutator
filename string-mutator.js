(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * 
 * https://github.com/kristianmandrup/string-mutator
 *
 * Copyright (c) 2014 Kristian Mandrup
 * Licensed under the MIT license.
 */

'use strict';

var firstIndex = function(expr, str) {
  var matches = str.match(expr);
  if (matches.length == 0) return null;
  var matched = matches[0];
  var index = str.indexOf(matched);
  return {index: index, matched: matched};  
}

var lastIndex = function(expr, str) {
  var matches = str.match(expr);
  if (matches.length == 0) return null;
  var matched = matches[matches.length -1];
  var index = str.indexOf(matched);
  return {index: index, matched: matched};  
}

var createObj = function(expr, indexFun) {  
  return {
    prepend: function (prependStr, str, options) {
      options = options || {}
      var idx = indexFun(expr, str);    
      
      if (idx == null || idx.index < 0) {
        if (options.force)
          return prependStr.concat(str);
        else
          return null;
      }

      var first = str.slice(0, idx.index);
      var rest = str.slice(idx.index);
      return first.concat(prependStr).concat(rest);
    },
    append: function (appendStr, str, options) {
      options = options || {}
      var idx = indexFun(expr, str);    

      if (idx == null || idx.index < 0) {
        if (options.force)
          return str.concat(appendStr);
        else
          return null;
      }

      var first = str.slice(0, idx.index);
      var rest = str.slice(idx.index + idx.matched.length);
      return first.concat(idx.matched).concat(appendStr).concat(rest);
    }
  };
};


var first = function (expr) {
  return createObj(expr, firstIndex);
};

var last = function (expr) {
  return createObj(expr, lastIndex);
};

module.exports = {
  first: first,
  last: last
}

},{}]},{},[1])