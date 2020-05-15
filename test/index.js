var test = require("tape");
var unhookSVG = require("../index.js");

// Ripped from https://github.com/ariporad/pirates/blob/master/src/index.js#L7-L8
const BuiltinModule = require("module");
const Module = module.constructor.length > 1 ? module.constructor : BuiltinModule;

test("SVG node hook returns a stringified version of an SVG file", function (t) {
  var svg = require("./star.svg");
  var expectedOutcome = '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) --> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 5184 2592" enable-background="new 0 0 5184 2592" xml:space="preserve"> <g> <path d="M3884.3,1004.6c8,23.9,4,44-12,60l-629.7,626.5l158.8,836.6c4,23.9-4,42-23.9,54c-8,6-17.9,9-29.9,9s-22.1-3-30.1-9 L2592,2113.9l-725.6,467.7c-19.9,13.9-40.1,13.9-60,0c-19.9-12-28.1-29.9-23.9-54l158.8-836.6l-629.7-626.7 c-15.9-15.9-19.9-35.9-12-59.8c10-21.9,26.9-32.9,51-32.9h827.6l362.9-935.4C2550.9,12,2568.1,0,2592,0s40.9,12,51,36.1 l362.9,935.4h827.6C3857.2,971.5,3874.3,982.4,3884.3,1004.6L3884.3,1004.6z"/> </g> </svg>';
  t.equal(svg, expectedOutcome, "Requiring a '.svg' file returns a stringified version of the file.");
  t.end();
});

test("SVG node hook is registered", function (t) {
  t.equal(typeof Module._extensions[".svg"], "function", "A function is registered for handling SVG files.");
  t.end()
});

test("SVG node hook exports a function that unregisters the hook", function (t) {
  unhookSVG();
  t.equal(Module._extensions[".svg"], Module._extensions['.js'], "No function is registered for handling SVG files after calling exported function.");
  t.end();
});
