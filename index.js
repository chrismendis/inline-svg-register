cache = require("babel-register/lib/cache");
each = require("lodash/each");
fs = require("fs");

var EXTENSIONS = [".svg"];
var oldHandlers = {};

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
function compile(filename) {
  var result, cached;

  var cacheKey = "svg-inliner-node-hook:" + filename;

  var env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env) {
    cacheKey += ":" + env;
  }

  if (cache) {
    cached = cache[cacheKey];
    if (cached && cached.mtime === mtime(filename)) {
      result = cached;
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

// Ripped from https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js
function loader(m, filename) {
  m._compile(compile(filename), filename);
}

// Adapted from https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js
function registerExtension(ext) {
  require.extensions[ext] = function (m, filename) {
    loader(m, filename);
  };
}

// Ripped from https://github.com/babel/babel/blob/master/packages/babel-register/src/node.js
function hookExtensions(_exts) {
  each(oldHandlers, function (old, ext) {
    if (old === undefined) {
      delete require.extensions[ext];
    } else {
      require.extensions[ext] = old;
    }
  });

  oldHandlers = {};

  each(_exts, function (ext) {
    oldHandlers[ext] = require.extensions[ext];
    registerExtension(ext);
  });
}

function unhookExtensions() {
  each(oldHandlers, function (old, ext) {
    if (old === undefined) {
      delete require.extensions[ext];
    } else {
      require.extensions[ext] = old;
    }
  });

  oldHandlers = null;
}

hookExtensions(EXTENSIONS);

module.exports = unhookExtensions;
