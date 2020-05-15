cache = require("babel-register/lib/cache");
each = require("lodash/each");
fs = require("fs");
const { addHook } = require('pirates')

var EXTENSIONS = [".svg"];
let piratesRevert = null;

function normalizeString(source) {
  source = source.replace(/'/g, "\\'");
  source = source.replace(/[\n\r\t]/g, " ").replace(/\s+/g, " ");
  return source.trim();
}

function transformFileSync(filename) {
  var result = {};

  source = normalizeString(fs.readFileSync(filename).toString());

  result.code = "module.exports = '" + source + "';"
  return result;
}

// Ripped from https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js
function mtime(filename) {
  return +fs.statSync(filename).mtime;
}

// Adapted from https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js
function compile(_code, filename) {
  var result, cached;

  var cacheKey = "svg-inliner-node-hook:" + filename;

  var env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env) {
    cacheKey += ":" + env;
  }

  if (cache) {
    cached = cache[cacheKey];
    if (cached && cached.mtime === mtime(filename)) {
      result = cached.code;
    }
  }

  if (!result) {
    result = transformFileSync(filename);
  }

  if (cache) {
    cache[cacheKey] = result;
    result.mtime = mtime(filename);
  }

  return result.code;
}

// Ripped from https://github.com/babel/babel/pull/3670/files#diff-75a0292ed78043766c2d5564edd84ad2R80-R83
function hookExtensions(_exts) {
  if (piratesRevert) piratesRevert();
  piratesRevert = addHook(compile, { exts: _exts, ignoreNodeModules: true });
}

// Ripped from https://github.com/babel/babel/pull/3670/files#diff-75a0292ed78043766c2d5564edd84ad2R80-R88
function revert() {
  if (piratesRevert) piratesRevert()
  delete require.cache[require.resolve(__filename)]
}

hookExtensions(EXTENSIONS);

module.exports = revert;
