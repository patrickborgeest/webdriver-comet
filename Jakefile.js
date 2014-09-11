/*jslint node: true, indent: 2, regexp: true */
/*global desc, task, jake */
"use strict";

var cp = require('child_process'),
  runner = require('./src/runner'),
  jakeify = require('./lib/simplebuild-ext-jakeify.js').map,
  jslint = jakeify('../src/simplebuild-jslint.js'),
  startSelenium,
  srcfiles,
  testfiles;

desc('Run all');
task('default', ['lint', 'test'], function () {
  return true;
});

desc('Start webdriver -- run this first');
task('webdriver', startSelenium);

desc('Test everything');
task('test', function () {
  runner.run(testfiles());
});

desc('Lint everything');
jslint.validate.task('lint', {
  files: srcfiles(),
  options: {}
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

function startSelenium() {
  var selenium = cp.spawn('java', ['-jar', 'lib/selenium-server-standalone-2.42.2.jar']);
  selenium.stdout.setEncoding('utf8');
  selenium.stderr.setEncoding('utf8');
  selenium.stdout.on('data', function (data) {
    var match = /RemoteWebDriver instances should connect to: (.*)/.exec(data);
    if (match !== null) {
      console.log(String(match[1]));
    }
  });
  selenium.stderr.on('data', function (data) {
    if (/^execvp\(\)/.test(data)) {
      console.log('Failed to start child process: ', data);
    }
  });
}

