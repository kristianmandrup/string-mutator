fs = require('fs');
sm = require('./string-mutator');

var DummyFileWriter = function(path, txt) {
  return {
    read: function() {
      return null;
    },
    original: txt,
    lastWritten: null,
    write: function(newContent) {
      return null;
    },

    // write mutated output to another file
    writeFile: function(newPath, newContent) {
      return null;
    }    
  }
};

var FileWriter = function(path, content) {
  // TODO: if no content throw Error?
  var inputTxt = content ? content.slice(0) : '';
  return {
    read: function() {
      return String(fs.readFileSync(path));
    },
    original: inputTxt,
    lastWritten: null,
    write: function(newContent) {
      newContent = newContent || inputTxt
      // write to same file that was read in readFile
      this.writeFile(path, newContent)

      return this;
    },

    // write mutated output to another file
    writeFile: function(newPath, newContent) {
      newContent = newContent || inputTxt
      
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
        var performed = performer.call(ctx);

        if (typeof performed === 'undefined')
          throw new Error("No result from perform, I think you forgot to return the value!");

        var res = performed ? performed.result : null;
        if (res)
          return FileWriter(path, res);
        else {
          return DummyFileWriter(path, fileTxt);
        }          
      },
      content: fileTxt,
    }    
  }
}

module.exports = File