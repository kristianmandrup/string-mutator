(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
fs = require('fs');
sm = require('./string-mutator');

var FileWriter = function(path, content) {
  return {
    read: function() {
      return String(fs.readFileSync(path));
    },
    lastWritten: null,
    write: function(newContent) {
      newContent = newContent || content
      // write to same file that was read in readFile
      this.writeFile(path, newContent)

      return this;
    },

    // write mutated output to another file
    writeFile: function(newPath, newContent) {
      newContent = newContent || content
      
      try {
        fs.writeFileSync(newPath, newContent);
        this.lastWritten = newContent;
        return this;
      } catch (e) {
        console.error('writeFile', e);
        return this;
      }      
    }    
  }
};

var File = {
  // read content from file
  readFile: function(path) {
    var fileTxt = String(fs.readFileSync(path));
    var ctx = sm.content(fileTxt);
    return {
      perform: function(performer) {
        var res = performer.call(ctx);
        return FileWriter(path, res);
      },
      content: fileTxt,
    }    
  }
}

module.exports = File
},{"./string-mutator":3,"fs":4}],2:[function(require,module,exports){
module.exports = {
  sm: require('./string-mutator'),
  fm: require('./file-mutator')
}
},{"./file-mutator":1,"./string-mutator":3}],3:[function(require,module,exports){
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

// append/prepend
var appendObj = function(expr, str, indexFun, ctx) {
  var toFun = function (content) {
    var idx = indexFun(expr, content);    

    if (idx == null || idx.index < 0) {
      if (options.force)
        return content.concat(str);
      else
        return null;
    }

    var first = content.slice(0, idx.index);
    var rest = content.slice(idx.index + idx.matched.length);
    return first.concat(idx.matched).concat(str).concat(rest);      
  }

  return ctx ? toFun : {to: toFun}
}

// TODO: should take function as last arg
var prependObj = function(expr, str, indexFun, ctx) {
  var toFun = function (content) {
    var idx = indexFun(expr, content);
    if (idx == null || idx.index < 0) {
      if (options.force)
        return str.concat(content);
      else
        return null;
    }

    var first = content.slice(0, idx.index);
    var rest = content.slice(idx.index);
    return first.concat(str).concat(rest);
  };
  return ctx ? toFun : {to: toFun}
}

var createAction = function(action, expr, indexFun, content, ctx) {
  return function (str, text, options) {
    options = options || {}
    text    = text || content;

    var obj = action(expr, str, indexFun, ctx);
    if (ctx) return obj(text);
    return text ? obj.to(text) : obj;
  };
}

var replaceObj = function(expr, str, withStr, indexFun, ctx) {
  var onFun = function (content) {
    var idx = indexFun(expr, str);    
    
    if (idx == null || idx.index < 0) {
        return null;
    }

    var first = content.slice(0, idx.index);
    var rest = content.slice(idx.index + idx.matched.length);
    return first.concat(withStr).concat(rest);
  }
  return ctx ? onFun : {on: onFun}
}

var createReplaceAction = function(action, expr, indexFun, content, removeStr, ctx) {
  return function (str, withStr, text, options) {
    options = options || {}
    text    = text || content;
    withStr = removeStr ? removeStr : withStr;

    var obj = action(expr, str, withStr, indexFun, ctx);
    if (ctx) return obj(text);
    return text ? obj.on(text) : obj;
  };
}

var actors = {
  replacer: replaceObj,
  prepender: prependObj,
  appender: appendObj
};    


var createObj = function(expr, indexFun, content, ctx) {  
  return {
    replace: createReplaceAction(actors.replacer, expr, indexFun, content, null, ctx),

    remove: createReplaceAction(actors.replacer, expr, indexFun, content, '', ctx),

    prepend: createAction(actors.prepender, expr, indexFun, content, ctx),
    append: createAction(actors.appender, expr, indexFun, content, ctx)
  };
};


var first = function (expr) {
  return createObj(expr, firstIndex);
};

var last = function (expr) {
  return createObj(expr, lastIndex);
};

var content = function(txt) {
  return {
    first: function(expr) {
      return createObj(expr, firstIndex, txt, true);        
    },
    last: function(expr) {
      return createObj(expr, lastIndex, txt, true);        
    },
    between: function(startExpr) {
      var startIndex = txt.match(startExpr);
      return {
        and: function(endExpr) {
          var endIndex = txt.match(endExpr);
          var newTxtScope = txt.slice(0).slice(startIndex, endIndex);
          return content(newTxtScope);
        }
      }
    }
  };
};

module.exports = {
  actors: actors,
  content: content,
  first: first,
  last: last
}

},{}],4:[function(require,module,exports){

},{}]},{},[2])