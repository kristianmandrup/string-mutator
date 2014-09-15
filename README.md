#  [![Build Status](https://secure.travis-ci.org/kristianmandrup/string-mutator.png?branch=master)](http://travis-ci.org/kristianmandrup/string-mutator)

Prepend/append content before/after first/last match. 

Created in order to simplify simple automatic code refactoring 
for use in code generators...

## Getting Started

Install the module with: `npm install string-mutator`

```js
var string-mutator = require('string-mutator');
string-mutator.awesome(); // "awesome"
```

Install with cli command

```sh
$ npm install -g string-mutator
$ string-mutator --help
$ string-mutator --version
```

```sh
# creates a browser.js
$ grunt browserify
```

## Documentation

See `/examples` folder ;)

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

### Replace

Can also be used with `first` or `last`

```javascript
var msg = "Peter has 8 dollars and Jane has 15$"
var res = sm.last(/\d+/g).replace('15', '42', msg);
// res = sm.last(/\d+/g).replace('15', '42').on(msg);

// => "Peter has 8 dollars and Jane has 42");
```

### Remove

Replace with empty content...

var res = sm.last(/\d+/g).remove('15').on(msg);

```javascript
var msg = "Peter has 8 dollars and Jane has 15$"
var res = sm.last(/\d+/g).remove('and Jane has 15$', msg);

// => "Peter has 8 dollars");
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. 

Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Kristian Mandrup  
Licensed under the MIT license.
