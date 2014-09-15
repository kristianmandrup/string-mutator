#  [![Build Status](https://secure.travis-ci.org/kristianmandrup/string-mutator.png?branch=master)](http://travis-ci.org/kristianmandrup/string-mutator)

Perform mutation operations on text strings (or text files). 
Useful for (simple) automatic code refactorings f.ex in code generators.

## Getting Started

Install the module with: `npm install string-mutator`

Install with cli command

```sh
$ npm install -g string-mutator
$ string-mutator --help
$ string-mutator --version
```

*Browserify*

```sh
$ npm run-script browser
```

## Documentation

```javascript
var mutators = require('../lib/mutators');
var sm = mutators.string; // string mutator
var fm = mutators.file; // file mutator

var msg = "Peter has 8 dollars and Jane has 15"
sm.content(msg).last(/\d+/g).remove('Jane has 15');

// File mutator - performing string mutations
fm.readFile('test/files/test.txt').perform(function() {
    return this.first(/\d+/).prepend('$');
  }).write();

console.log('wrote', written, res.lastWritten);
res.write(res.original);
```

## String mutator API

### first.prepend

```javascript
var sm = require('../lib/string-mutator.js');

var msg = "Peter has 8 dollars and Jane has 15"
var res = sm.first(/\d+/g).prepend('$', msg);

// => "Peter has $8 dollars and Jane has 15"
```

The following pattern valid for any prepend/append action.

`<action>(text).to(content)*``

`append(text).to(content)` or `prepend(text).to(content)`

```javascript
var sm = require('../lib/string-mutator.js');

var msg = "Peter has 8 dollars and Jane has 15"
var res = sm.first(/\d+/g).prepend('$').to(msg);

// => "Peter has $8 dollars and Jane has 15"
```

### first.append

```javascript
var msg = "Peter has 8 dollars and Jane has 15"
var res = sm.first(/\d+/g).append('$', msg);
res = sm.first(/\d+/g).append('$').to(msg);

// => "Peter has 8$ dollars and Jane has 15"
```

### last.prepend

```javascript
var msg = "Peter has 8 dollars and Jane has 15"
var res = sm.last(/\d+/g).prepend('$', msg);
// res = sm.last(/\d+/g).prepend('$').to(msg);

// => "Peter has 8 dollars and Jane has $15");
```

### last.append

```javascript
var msg = "Peter has 8 dollars and Jane has 15$"
var res = sm.last(/\d+/g).append('$', msg);
// res = sm.last(/\d+/g).append('$').to(msg);

// => "Peter has 8 dollars and Jane has 15$");
```

### replace

Can also be used with `first` or `last`

```javascript
var msg = "Peter has 8 dollars and Jane has 15$"
var res = sm.last(/\d+/g).replace('15', '42', msg);
// res = sm.last(/\d+/g).replace('15', '42').on(msg);

// => "Peter has 8 dollars and Jane has 42");
```

### remove

Replace match with empty content ;)

var res = sm.last(/\d+/g).remove('15').on(msg);

```javascript
var msg = "Peter has 8 dollars and Jane has 15"
var res = sm.last(/\d+/g).remove('and Jane has 15', msg);

// => "Peter has 8 dollars");
```

## Content

You can also start by wrapping the text in a `content` object

```javascript
var msg = "Peter has 8 dollars and Jane has 15"
sm.content(msg).last(/\d+/g).remove('Jane has 15');

// => "Peter has 8 dollars");
```

### Between

A `between` object takes a `content` object and returns a new `content` object with the text between two matches.

```javascript
var msg = "Peter has 15 dollars, Jane has 15 and Paul has 32 or 15"
sm.content(msg).between(/Peter/).and(/Paul/).last(/\d+/g).replace('20');

// => Peter has 15 dollars, Jane has 20 and Paul has 32 or 15
```

## File mutator

Note: `.perform` wraps the read content in a `content` object (see string-mutator above)

```javascript
fm.readFile('test/files/test.txt').perform(function() {
    return this.first(/\d+/).prepend('$');
  }).write();

console.log('wrote', written, res.lastWritten);
res.write(res.original);

res.writeFile('another_file.txt');
```

## TODO

Cleanup and Refactor...

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. 

Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Kristian Mandrup  
Licensed under the MIT license.
