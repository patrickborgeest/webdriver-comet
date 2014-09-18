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

desc('Test just the current test');
task('one', ['lint'], function () {
  runner.run(['test/COMS-122_test.js']);
});

desc('Lint everything');
jslint.validate.task('lint', {
  files: srcfiles(),
  options: {node: true, indent: 2}
});

desc('Troubleshooting');
task('troubleshoot', function () {
  console.log('If the tests hang at the start with a blank browser');
  console.log('and an error message about not being able to connect to Firefox,');
  console.log('then try:');
  console.log('  - go to https://www.npmjs.org/package/selenium-webdriver');
  console.log('  - find the latest version number ');
  console.log('  - change the selenium-webdriver version number in package.json to match');
  console.log('  - run "npm update"');
  console.log('  - profit');
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
  files.include('test/*_test.js');
  return files.toArray();
}

