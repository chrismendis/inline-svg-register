# inline-svg-register

`babel-register` for SVG files.™

[![Build Status](https://travis-ci.org/chrismendis/inline-svg-register.svg?branch=master)](https://travis-ci.org/chrismendis/inline-svg-register)

## Installation

```npm install --save-dev inline-svg-register```

## Usage

### Registering the SVG `require()` hook

`require("inline-svg-register")` in any file, as long as it comes before you `require()` any SVG files.

#### Example

```javascript
require("inline-svg-register");
var svg = require("./my-cool.svg");
```

### Unregistering the SVG `require()` hook

`inline-svg-register`'s export is a function that, when called, will unregister the `require()` hook that it added.

#### Example

```javascript
var unhook = require("inline-svg-register");
var svg = require("./my-cool.svg");
unhook();
```

## Motivation

Imagine that you have a Webpack-bundled JavaScript app that uses the [`raw-loader`](https://github.com/webpack/raw-loader) to `require()` in SVG file contents as a string.

You also have a very simple [`tape`](https://github.com/substack/tape) test setup that just `require()`s in whatever files that you want to test.

If you try to test any files that contain `require()` calls to SVG files, node will throw a parsing error on those calls because node expects *only* JavaScript files to be passed to `require()`.

CoffeeScript and Babel both get around this constraint by extending node's file type support using a deprecated feature: [`require.extensions`](https://nodejs.org/api/globals.html#globals_require_extensions). This feature allows node to compile CoffeeScript or ES2015 on-the-fly to JavaScript that node can parse. I adapted Babel's solution, called [`babel-register`](https://github.com/babel/babel/tree/master/packages/babel-register), to compile an SVG file on-the-fly to a JavaScript string.
