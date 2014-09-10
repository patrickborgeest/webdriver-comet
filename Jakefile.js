var cp = require('child_process'),
    runner = require('./src/runner');

desc('Run all');
task('default', ['test'], function () {
});

desc('Start webdriver -- run this first')
task('webdriver', startSelenium);

desc('Test everything');
task('test', function () {
  runner.run(testfiles());
});

function testfiles() {
  var testfiles = new jake.FileList();
  testfiles.include('test/*_test.js');
  return testfiles.toArray();
}

function startSelenium() {
  var selenium = cp.spawn('java', ['-jar', 'lib/selenium-server-standalone-2.42.2.jar']);
  selenium.stdout.setEncoding('utf8');
  selenium.stderr.setEncoding('utf8');
  selenium.stdout.on('data', function (data) {
    var match = /RemoteWebDriver instances should connect to: (.*)/.exec(data);
    if (match !== null) {
      console.log('' + match[1]);
    }
  });
  selenium.stderr.on('data', function (data) {
    if (/^execvp\(\)/.test(data)) {
      console.log('Failed to start child process: ', data);
    }
  });
}

