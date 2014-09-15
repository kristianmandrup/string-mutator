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