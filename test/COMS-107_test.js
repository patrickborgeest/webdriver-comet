/*global window */
"use strict";

var assert = require('assert'), webdriver, driver, By,
  loginAsDominique, goToContacts, assertDominiqueIsNotListedAsAContact,
  logout, dlay = function (ms) { return webdriver.promise.delayed(ms); };

exports.run = function (inwebdriver, indriver) {
  webdriver = inwebdriver;
  driver = indriver;
  By = webdriver.By;

  loginAsDominique();
  goToContacts();
  assertDominiqueIsNotListedAsAContact();
};

function loginAsDominique() {
  driver.get('http://comet.paddy')
    .then(function () { console.log('Running COMS-107_test'); return this; });
  //driver.findElement(By.css('#main-updates .update-column .update-image'));
  //logout();
  driver.findElement(By.name('username')).sendKeys('dominique.fisher@helixdigital.com.au');
  driver.findElement(By.name('password')).sendKeys('password');
  driver.findElement(By.css('form#login-form > input[type="submit"]')).click();
  driver.findElement(By.css('#subnav-create'));
}

function goToContacts() {
  driver.findElement(By.css('a[href="/contacts"]')).click();
}

function assertDominiqueIsNotListedAsAContact() {

  var profilelinks, profileids, foundDom;

  foundDom = false;
  profilelinks = driver.findElements(By.css('#contacts .container ul.people-thumbs li.user-l a.profile-link'));
  profileids = profilelinks.then(function (elements) {
    return elements.map(function (element) {
      return element.getAttribute('data-profile_id');
    });
  });
  webdriver.promise.fullyResolved(profileids).then(function (profileids) {
    profileids.forEach(function (thisid) {
      if (thisid === '31') {
        foundDom = true;
      }
    });
    assert.ok(!foundDom, 'Expected to find no Dominique Fisher (id=31) in ' + profileids);
  });
}


function logout() {
  return driver.executeScript(function () { if (window.cl.logout) { window.cl.logout(); } });
}

exports.cleanup = function () {
  logout();
};

