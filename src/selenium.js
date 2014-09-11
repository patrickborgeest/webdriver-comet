/*global */
"use strict";

var cp = require('child_process');

exports.start = function () {
  var selenium = cp.spawn('java', ['-jar', './lib/selenium-server-standalone-2.42.2.jar']);
  selenium.stdout.setEncoding('utf8');
  selenium.stderr.setEncoding('utf8');
  selenium.stdout.on('data', function (data) {
    var match = /RemoteWebDriver instances should connect to: ([a-z0-9:\.\/]+)/.exec(data);
    if (match !== null) {
      console.log(String(match[1]));
    }
  });
  selenium.stderr.on('data', function (data) {
    if (/^execvp\(\)/.test(data)) {
      console.log('Failed to start child process: ', data);
    }
  });
};
