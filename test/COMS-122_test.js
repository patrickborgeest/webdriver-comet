/*global window */
"use strict";

var By, webdriver, driver, loginAsPaddy, getPincount,
  unpinSomething, assert = require('assert'),
  finaldeferred;

exports.run = function (inwebdriver, indriver) {
  webdriver = inwebdriver;
  driver = indriver;
  By = webdriver.By;

  finaldeferred = webdriver.promise.defer();

  driver.get('http://comet.paddy')
    .then(function () {console.log('Running COMS-122_test'); });
  loginAsPaddy();
  getPincount().then(function (originalPincount) {
    unpinSomething();
    getPincount().then(function (newcount) {
      assert.equal(originalPincount, newcount + 1,
        'Supposed to have unpinned something (' + originalPincount + ' != ' +
        newcount + ' + 1)'
        );
      // re-pin as a tearDown for next time
      finaldeferred.then(function (url) {
        driver.get(url);
        driver.findElement(By.css('#subnav-right #subnav-pin a[href="#pin"]')).click();
      });
    });
  });
};

function logout() {
  return driver.executeScript(function () { if (window.cl) { window.cl.logout(); } });
}

exports.cleanup = function () {
  logout();
};

function loginAsPaddy() {
  driver.findElement(By.name("username")).sendKeys("patrick.borgeest@helixdigital.com.au");
  driver.findElement(By.name("password")).sendKeys("password");
  driver.findElement(By.css('form#login-form > input[type="submit"]')).click();
  driver.findElement(By.css('#subnav-create'));
  return driver.findElement(By.css('#main-updates .update-column .update-image'));
}

function getPincount() {
  var mypromise = webdriver.promise.defer();
  driver.findElement(By.css('#sidebar-scrollarea ul li a[href="/pinboard"]')).click().then(function () {
    driver.findElement(By.css('#pinboard .read-more-footer span.icon-pin'));
    driver.findElements(By.css('#pinboard .read-more-footer span.icon-pin')).then(function (updates) {
      webdriver.promise.all(updates).then(function (innerupdates) {
        mypromise.fulfill(innerupdates.length);
      });
    });
  });
  return mypromise.promise;
}

function unpinSomething() {
  driver.findElement(By.css('#pinboard .update > a')).click();
  driver.findElement(By.css('#overlay div.content'));
  driver.getCurrentUrl().then(function (url) { finaldeferred.fulfill(url); });
  driver.findElement(By.css('#subnav-right #subnav-pin a[href="#pin"]')).click();
}

