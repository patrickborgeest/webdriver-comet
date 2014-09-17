/*global window */
"use strict";

var By, webdriver, driver, loginAsPaddy, getPincount,
  unpinSomething, assert = require('assert'),
  unpinnedURLpromise;

exports.run = function (inwebdriver, indriver) {
  var pincountPromise;
  webdriver = inwebdriver;
  driver = indriver;
  By = webdriver.By;

  driver.get('http://comet.paddy')
    .then(function () {console.log('Running COMS-122_test'); });
  return loginAsPaddy()
    .then(function () {
      pincountPromise = getPincount();
      pincountPromise.then(function (count) {
        var newCountPromise;
        unpinSomething();
        newCountPromise = getPincount();
        newCountPromise.then(function (newcount) {
          assert.equal(count, newcount + 1, 'Supposed to have unpinned something');
        });
      });
    });

};

exports.cleanup = function () {
  unpinnedURLpromise.then(function (url) {
    driver.get(url);
    driver.findElement(By.css('#subnav-right #subnav-pin a[href="#pin"]')).click();
  });
};

function loginAsPaddy() {
  driver.findElement(By.name("username")).sendKeys("patrick.borgeest@helixdigital.com.au");
  driver.findElement(By.name("password")).sendKeys("password");
  driver.findElement(By.css('form#login-form > input[type="submit"]')).click();
  driver.findElement(By.css('#subnav-create'));
  return driver.findElement(By.css('#main-updates .update-column .update-image'));
}

function getPincount() {
  var updates;
  driver.findElement(By.css('#sidebar-scrollarea ul li a[href="/pinboard"]')).click();
  updates = driver.findElements(By.css('#pinboard .update'));
  return webdriver.promise.when(updates.then(function (upd) { return upd.length; }));
}

function unpinSomething() {
  driver.findElement(By.css('#pinboard .update > a')).click();
  driver.findElement(By.css('#overlay div.content'));
  unpinnedURLpromise = driver.getCurrentUrl();
  driver.findElement(By.css('#subnav-right #subnav-pin a[href="#pin"]')).click();
}

