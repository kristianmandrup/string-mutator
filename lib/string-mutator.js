/*
 * 
 * https://github.com/kristianmandrup/string-mutator
 *
 * Copyright (c) 2014 Kristian Mandrup
 * Licensed under the MIT license.
 */

'use strict';

var regexIndexOf = function(string, pattern, startIndex )
{
    startIndex = startIndex || 0;
    var searchResult = string.substr( startIndex ).search( pattern );
    return ( -1 === searchResult ) ? -1 : searchResult + startIndex;
}

var regexLastIndexOf = function(string, pattern, startIndex )
{
    startIndex = startIndex === undefined ? string.length : startIndex;
    var searchResult = string.substr( 0, startIndex ).reverse().regexIndexOf( pattern, 0 );
    return ( -1 === searchResult ) ? -1 : string.length - ++searchResult;
}

var reverse = function(string)
{
    return string.split('').reverse().join('');
}

var firstIndex = function(expr, str) {
  var matches = str.match(expr);
  if (!matches || matches.length == 0) {
    return null;
  }
  var matched = matches[0];
  var index = str.indexOf(matched);
  return {index: index, matched: matched};  
}

var lastIndex = function(expr, str) {
  var matches = str.match(expr);
  if (!matches || matches.length == 0) return null;
  var matched = matches[matches.length -1];
  var index = str.lastIndexOf(matched);
  return {index: index, matched: matched};  
}

// append/prepend
var appendObj = function(expr, str, indexFun, ctx, contentCtx, endStr) {
  var toFun = function (content) {
    var idx = indexFun(expr, content);    
    var result;
    if (idx == null || idx.index < 0) {
      if (options.force)
        result = content.concat(str);
      else
        result = content;
    }

    var first = content.slice(0, idx.index);
    var rest = content.slice(idx.index + idx.matched.length);
    result = first.concat(idx.matched).concat(str).concat(rest);      

    if (contentCtx) {
      return {
        mergeRest: mergeRest(contentCtx),
        result: result + endStr
      }
    }
    return result + endStr;
  }

  return ctx ? toFun : {to: toFun}
}

// TODO: should take function as last arg
var prependObj = function(expr, str, indexFun, ctx, contentCtx, endStr) {
  var toFun = function (content) {
    var idx = indexFun(expr, content);
    var result;
    if (idx == null || idx.index < 0) {
      if (options.force)
        result = str.concat(content);
      else
        result = content;
    } else {
      var first = content.slice(0, idx.index);
      var rest = content.slice(idx.index);
      result = first.concat(str).concat(rest);      
    }

    if (contentCtx) {
      return {
        mergeRest: mergeRest(contentCtx),
        result: result + endStr
      }
    } 
    return result + endStr;
  };
  return ctx ? toFun : {to: toFun}
}

var createAction = function(action, expr, indexFun, content, ctx, contentCtx, endStr) {
  return function (str, text, options) {
    options = options || {}
    text    = text || content;

    var obj = action(expr, str, indexFun, ctx, contentCtx, endStr);
    if (ctx) return obj(text);
    return text ? obj.to(text) : obj;
  };
}

var replaceObj = function(expr, withStr, indexFun, content, ctx, contentCtx, endStr) {
  var onFun = function (txt) {
    txt = txt || content
    var idx = indexFun(expr, txt);    
    var result;    
    if (idx == null || idx.index < 0) {
        result = content;
    } else {
      var first = txt.slice(0, idx.index);
      var rest = txt.slice(idx.index + idx.matched.length);
      result = first.concat(withStr).concat(rest) + endStr;      
    }

    if (contentCtx) {
      return {
        mergeRest: mergeRest(contentCtx),
        result: result
      }
    }
    return result;
  }
  return ctx ? onFun : {on: onFun}
}

var createReplaceAction = function(action, expr, indexFun, content, removeStr, ctx, contentCtx, endStr) {
  endStr = endStr || ''
  return function (withStr, text, options) {
    options = options || {}
    text    = text || content;
    withStr = removeStr ? removeStr : withStr;

    var obj = action(expr, withStr, indexFun, content, ctx, contentCtx, endStr);

    if (ctx) return obj(text);
    return text ? obj.on(text) : obj;
  };
}

var createRemoveAction = function(action, expr, indexFun, content, removeStr, ctx, contentCtx) {
  return function (text, withStr) {
    text    = text || content;
    withStr = withStr || removeStr;

    var obj = action(expr, withStr, indexFun, content, ctx, contentCtx);
    if (ctx) return obj(text);
    return text ? obj.on(text) : obj;
  };
}


var actors = {
  replacer: replaceObj,
  prepender: prependObj,
  appender: appendObj
};    


var mergeRest = function (contentCtx) {
  return function() {
    var res = this.result;
    // console.log('contentCtx', contentCtx);
    if (contentCtx.remainderAfter)
      res = res.concat(contentCtx.remainderAfter);

    if (contentCtx.remainderBefore)
      res = contentCtx.remainderBefore.concat(res);
    this.result = res
    return res;
  }
};


var createObj = function(expr, indexFun, content, ctx, contentCtx, endStr) {  
  return {
    replaceWith: createReplaceAction(actors.replacer, expr, indexFun, content, null, ctx, contentCtx),
    replaceWithLine: createReplaceAction(actors.replacer, expr, indexFun, content, null, ctx, contentCtx, endStr || '\n'),

    remove:  createRemoveAction(actors.replacer, expr, indexFun, content, '', ctx, contentCtx),

    prepend: createAction(actors.prepender, expr, indexFun, content, ctx, contentCtx),
    append:  createAction(actors.appender, expr, indexFun, content, ctx, contentCtx),

    prependLine: createAction(actors.prepender, expr, indexFun, content, ctx, contentCtx, endStr || '\n'),
    appendLine:  createAction(actors.appender, expr, indexFun, content, ctx, contentCtx, endStr || '\n')

  };
};

var first = function (expr) {
  return createObj(expr, firstIndex);
};

var last = function (expr) {
  return createObj(expr, lastIndex);
};

var content = function(txt, ctx) {
  var contentObj = {
    result: txt,
    first: function(expr) {
      return createObj(expr, firstIndex, txt, true, ctx || this);        
    },
    last: function(expr) {
      return createObj(expr, lastIndex, txt, true, ctx || this);        
    },
    appendTxt: function(apTxt) {
      // TODO: first(this.lastMatch).append(preTxt) ?
      var copy = txt.slice(0);
      switch (this.lastOp) {
        case 'before':
        case 'after':
          var index = regexIndexOf(txt, this.lastMatch);
          txt = copy.substring(0, index + this.lastMatch.length).concat(apTxt).concat(copy.substring(index + this.lastMatch.length));
          break;
        default:
          txt = txt.concat(apTxt);
      }
      this.result = txt;
      return this;
    },
    prependTxt: function(preTxt) {
      var copy = txt.slice(0);
      switch (this.lastOp) {
        case 'before':
          // TODO: first(this.lastMatch).prepend(preTxt) ?
          var matchTxt = txt + this.lastMatchTxt;          
          var index = regexIndexOf(matchTxt, this.lastMatch);
          txt = copy.substring(0, index).concat(preTxt).concat(copy.substring(index));
          break;
        case 'after':
          break;
        default:
          txt = preTxt.concat(txt);
      }
      this.result = txt;
      return this;      
    },
    before: function(startExpr, options) {
      options = options || {}
      var startMatches = txt.match(startExpr);
      var matchIndex = 0; // first
      if (startMatches && startMatches.length > 0) {
        if (options.match == 'last') 
          matchIndex = startMatches.length -1; // last
      }
        
      var startMatch = startMatches[matchIndex];

      if (!startMatch) {
        throw new Error("No match for " + String(startExpr) + " in " + txt);
      }
      var startIndex = txt.indexOf(startMatch);
      var txtCopy = txt.slice(0);
      var cutIndex = options.include ? startIndex + startMatch.length : startIndex;
      var newTxtScope = txtCopy.slice(0, cutIndex);
      this.remainderAfter = txtCopy.slice(cutIndex);
      this.remainderBefore = null;
      this.lastOp = 'before';
      this.lastMatch = startExpr;      
      this.lastMatchTxt = startMatch;
      return content(newTxtScope, this);
    },
    after: function(endExpr, options) {
      options = options || {}
      var endMatches = txt.match(endExpr);

      var matchIndex = 0; // first
      if (endMatches && endMatches.length > 0) {
        if (options.match == 'last') 
          matchIndex = startMatches.length -1; // last        
      }
      var endMatch = endMatches[matchIndex];

      if (!endMatch) {
        throw new Error("No match for " + String(endExpr) + " in " + txt);
      }
      var endIndex = txt.indexOf(endMatch);
      var txtCopy = txt.slice(0);
      var cutIndex = options.include ? endIndex : endIndex + endMatch.length;

      var newTxtScope = txtCopy.slice(cutIndex);

      this.remainderBefore = txtCopy.slice(0, cutIndex);      
      this.remainderAfter = null;
      this.lastOp = 'after';
      this.lastMatch = endExpr;
      this.lastMatchTxt = endMatch;      
      return content(newTxtScope, this);
    }, 
    // TODO: Same as after(startExpr).before(endExpr)
    between: function(startExpr, options) {
      options = options || {}
      var startMatches = txt.match(startExpr);
      var startMatch;
      if (startMatches && startMatches.length > 0)
        startMatch = startMatches[0];

      var startIndex = 0;
      if (!startMatch && !options.force) {
        throw new Error("No match for " + String(startExpr) + " in " + txt);
      }
      var startIndex = txt.indexOf(startMatch);
      if (options.include)
          startIndex = startIndex + startMatch.length

      return {
        and: function(endExpr, options) {
          options = options || {}
          var rest = txt.slice(0).slice(startIndex);
          // ensure we are only matching after last match!
          var endMatches = rest.match(endExpr);
          var endMatch;
          if (endMatches && endMatches.length > 0)
            endMatch = endMatches[0];

          if (!endMatch && !options.force) {
            throw new Error("No match for " + String(endExpr) + " in " + txt);
          }
          var endIndexRest = rest.indexOf(endMatch);
          if (options.include)
              endIndexRest = endIndexRest + endMatch.length

          var endIndex = startIndex + endIndexRest;
          var txtCopy = txt.slice(0);
          var newTxtScope = txtCopy.slice(startIndex, endIndex);
          this.remainderBefore = txtCopy.slice(0, startIndex);      
          this.remainderAfter = txtCopy.slice(endIndex);
          this.lastOp = 'between';
          this.lastMatch = endExpr;          
          return content(newTxtScope, this);
        },
        andIncl: function(expr, options) {
          options = options || {}
          otions.include = true;
          this.and(expr, options);
        }           
      }
    },
    afterIncl: function(expr, options) {
      options = options || {}
      otions.include = true;
      this.after(expr, options);
    },
    beforeIncl: function(expr, options) {
      options = options || {}
      otions.include = true;
      this.before(expr, options);
    },
    betweenIncl: function(expr, options) {
      options = options || {}
      otions.include = true;
      this.between(expr, options);
    },
    afterLast: function(expr, options) {
      options = options || {}
      otions.match = 'last';
      this.after(expr, options);
    },
    beforeLast: function(expr, options) {
      options = options || {}
      otions.last = true;
      this.before(expr, options);
    }
  };
  contentObj.lastOp = ctx ? ctx.lastOp : null;
  contentObj.lastMatch = ctx ? ctx.lastMatch : null;
  contentObj.lastMatchTxt = ctx ? ctx.lastMatchTxt : null;
  contentObj.mergeRest = mergeRest(ctx || this);
  return contentObj;  
};

module.exports = {
  actors: actors,
  content: content,
  first: first,
  last: last
}
