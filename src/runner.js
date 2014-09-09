var webdriver = require('selenium-webdriver'),
    SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
    server;

exports.start = function () {
  server = new SeleniumServer('../lib/selenium-server-standalone-2.42.2.jar', {port: 4444});
  server.start();
};

exports.run = function (testfiles) {
  var thistest,
      driver =  new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.firefox())
        .build();

  driver.manage().timeouts().implicitlyWait(40 * 1000);

  try {
    testfiles.forEach(function (filename) {
      thistest = require(convert_filename(filename));
      thistest.run(webdriver, driver);
      thistest.cleanup(webdriver, driver);
    });
    driver.quit();
  } catch (err) {
    if (err.name === 'AssertionError') {
      console.log(
        'Assertion failed:\n',
        err.actual,err.operator,err.expected,'\n\n',
        err.message
      );
      thistest.cleanup(webdriver, driver);
      driver.quit();
      return false;
    }
    console.log('ERROR THROWN:',err);
    driver.quit();
    return false;
  }

};

function convert_filename(filename) {
  return '../' + filename;
}
