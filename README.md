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

*Quick start*

```javascript
var mutators = require('mutators');
var sm = mutators.string; // string mutator
var fm = mutators.file; // file mutator

var msg = "Peter has 8 dollars and Jane has 15"

// String mutator
sm.last('Jane has 15').remove().on(msg);

// using content
sm.content(msg).last(/\d+/g).replaceWith('32');


// File mutator - performing string mutations
fm.readFile('test/files/test.txt').perform(function() {
    return this.first(/\d+/).prepend('$');
  }).write();

console.log('wrote', written, res.lastWritten);
res.write(res.original);
```

## String mutator API

The string mutation API uses chaining. 
To start a chain, use any of:

- first(matchExpr)
- last(matchExpr)
- content(text)

### first and last

The `first` and `last` functions each take a matching expression that can be a simple string or a regular expression.

The result can chained with any of:

- append
- prepend
- replaceWith
- remove

### append and prepend

`sm.first(matchExpr).append('<FOUND>', target);`

*chaining*

Both `append` and `prepend` can be chained with `to` like this

`sm.first(matchExpr).append("\nEND").to(target);`

### relaceWith and remove

`sm.first(matchExpr).remove(target);`

*chaining*

`replace` and `remove` can be chained with `on` like this:

`sm.first(matchExpr).replaceWith(something).on(target);`

### first.prepend

```javascript
var sm = require('string-mutator');

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

### replaceWith

```javascript
var msg = "Peter has 8 dollars and Jane has 15$"
var res = sm.last(/\d+/g).replaceWith('42', msg);

res = sm.first(/\d+/g).replaceWith('42').on(msg);

// => "Peter has 8 dollars and Jane has 42");
```

### remove

Replace match with empty content ;)

```javascript
var msg = "Peter has 8 dollars and Jane has 15"
var res = sm.last('and Jane has 15').remove(msg);
sm.last(/\d+/g).remove().on(msg);

// => "Peter has 8 dollars");
```

## Content

An alternative is to start off by wrapping the text in a `content` object

Content can be chained with any of the following:

- first
- last
- between

```javascript
var msg = "Peter has 8 dollars and Jane has 15"
sm.content(msg).last('Jane has 15').remove();

// => "Peter has 8 dollars");
```

### Between

A `between` is chained on a `content` object and returns a new `content` object with the text between two matches.

```javascript
var msg = "Peter has 15 dollars, Jane has 15 and Paul has 32 or 15"
sm.content(msg).between(/Peter/).and(/Paul/).last(/\d+/g).replaceWith('20');

// => Peter has 15 dollars, Jane has 20 and Paul has 32 or 15
```

## File mutator API

File mutation always starts with `readFile`

var fileMutateObj = fm.readFile('test/files/test.txt');

The result of `readFile` should always be chained with `perform`, which performs the string mutation on the content read.

`perform` wraps the read content in a `content` object (see: String mutator API) which becomes `this` in the context/scope of the function.

```javascript
fm.readFile('test/files/test.txt').perform(function() {
    return this.first(/\d+/).prepend('$');
  })
```

The result of the `perform` mutation can be chained with any of:

- write([newContent])
- writeFile(fileName, [newContent])
- read()
- lastWritten
- original

Complete example:

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

Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Kristian Mandrup  
Licensed under the MIT license.
