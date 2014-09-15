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
var appendObj = function(expr, str, indexFun) {
  return {
    to: function (content) {
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
  };
}

// TODO: should take function as last arg
var prependObj = function(expr, str, indexFun) {
  return {    
    to: function (content) {
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
    }
  };
}

var replaceObj = function(expr, str, withStr, indexFun) {
  return {    
    on: function (content) {
      var idx = indexFun(expr, str);    
      
      if (idx == null || idx.index < 0) {
          return null;
      }

      var first = content.slice(0, idx.index);
      var rest = content.slice(idx.index + idx.matched.length);
      return first.concat(withStr).concat(rest);
    }
  };
}

var createAction = function(action, expr, indexFun, content) {
  return function (str, text, options) {
    options = options || {}
    text    = text || content;

    var obj = action(expr, str, indexFun);
    return text ? obj.to(text) : obj;
  };
}

var createReplaceAction = function(action, expr, indexFun, content, removeStr) {
  return function (str, withStr, text, options) {
    options = options || {}
    text    = text || content;
    withStr = removeStr ? removeStr : withStr;

    var obj = action(expr, str, withStr, indexFun);
    return text ? obj.on(text) : obj;
  };
}


var createObj = function(expr, indexFun, content) {  
  return {
    replace: createReplaceAction(replaceObj, expr, indexFun, content),

    remove: createReplaceAction(replaceObj, expr, indexFun, content, ''),

    writeFile: function(path) {
      path = path || filePath
      return fs.writeFileSync(path, content);
    },

    prepend: createAction(prependObj, expr, indexFun, content),
    append: createAction(appendObj, expr, indexFun, content)
  };
};


var first = function (expr) {
  return createObj(expr, firstIndex);
};

var last = function (expr) {
  return createObj(expr, lastIndex);
};

var file = function(path) {
  var fileContent = fs.readfileSync(path, 'utf8');
  return content(fileContent, path);
};

var content = function(content, filePath) {
  return {
    first: function(expr) {
      return createObj(expr, firstIndex, content, filePath);        
    },
    last: function(expr) {
      return createObj(expr, lastIndex, content, filePath);        
    }
  };
};

module.exports = {
  file: file,
  content: content,
  first: first,
  last: last
}
