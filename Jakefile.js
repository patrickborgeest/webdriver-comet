var cp = require('child_process'),
    runner = require('./src/runner');

desc('Start webdriver -- run this first')
task('webdriver', function () {
  var selenium = cp.spawn('java', ['-jar', 'lib/selenium-server-standalone-2.42.2.jar']);
  selenium.stdout.setEncoding('utf8');
  selenium.stdout.on('data', function (data) {
    if (/RemoteWebDriver instnances should connect to: (.*)/.test(data)) {
      console.log('' + data);
    }
  });
  selenium.stderr.setEncoding('utf8');
  selenium.stderr.on('data', function (data) {
    if (/^execvp\(\)/.test(data)) {
      console.log('Failed to start child process: ', data);
    }
  });
});

desc('test');
task('default', ['test'], function () {
});

desc('Test everything');
task('test', function () {
  runner.run(testfiles());
});

function testfiles() {
  var testfiles = new jake.FileList();
  testfiles.include('test/*_test.js');
  return testfiles.toArray();
}



