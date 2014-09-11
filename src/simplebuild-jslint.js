/*jslint node: true, indent: 2, stupid: true */
/*global */
"use strict";

var simplebuild = require('../lib/simplebuild.js');
var nodejslint = require('jslint');
var fs = require('fs');

function validateSource(sourceCode, options) {
  var jslint = nodejslint.load('latest'),
    myResult = jslint(sourceCode, options);
  if (myResult) { return true; }
  return jslint.errors;
}

function validateFile(filename, options) {
  var sourceCode = fs.readFileSync(filename, "utf8"),
    linted = validateSource(sourceCode, options);
  if (linted === true) { return true; }
  console.log('\n', filename, '\n ---------');
  linted.forEach(function (error) {
    if (error !== null) {
      console.log(error.line + ':' + error.character, '  ', error.reason, '\n', error.evidence);
    }
  });
  return false;
}

function validateFileList(fileList, options) {
  var pass = true;
  fileList.forEach(function (filename) {
    if (!validateFile(filename, options)) {
      pass = false;
    }
  });
  return pass;
}

exports.validate = function (options, success, failure) {
  var result = validateFileList(
    simplebuild.deglobSync(options.files),
    options.options
  );
  if (result) {
    success();
  } else {
    failure("JSLint found errors");
  }
};

exports.validate.title = "JSLint";
exports.validate.description = "Crockford's JSLint.";
