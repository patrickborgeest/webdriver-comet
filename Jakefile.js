/*global desc, task, jake */
"use strict";

var runner = require('./src/runner'),
  jakeify = require('./lib/simplebuild-ext-jakeify.js').map,
  jslint = jakeify('../src/simplebuild-jslint.js'),
  selenium = require('./src/selenium.js'),
  srcfiles,
  testfiles;

desc('Run all');
task('default', ['lint', 'test'], function () {
  return true;
});

desc('Start webdriver -- run this first');
task('start', function () {
  selenium.start();
});

desc('Test everything');
task('test', function () {
  runner.run(testfiles());
});

desc('Lint everything');
jslint.validate.task('lint', {
  files: srcfiles(),
  options: {node: true, indent: 2}
});

function srcfiles() {
  var files = new jake.FileList();
  files.include('Jakefile.js');
  files.include('src/**.js');
  files.include('test/**.js');
  return files.toArray();
}
function testfiles() {
  var files = new jake.FileList();
  files.include('test/COMS-116_test.js');
  //files.include('test/*_test.js');
  return files.toArray();
}

