"use strict";

var By, webdriver, driver,
  goToPatrickBorgeestsMainFeed,
  goToEditProfileForm,
  editMyBirthday,
  assertDidNotSubmit,
  assert = require('assert');

exports.run = function (inwebdriver, indriver) {
  webdriver = inwebdriver;
  driver = indriver;
  By = webdriver.By;

  driver.get('http://comet.paddy')
    .then(function () { console.log('Running COMS-94_test'); });
  goToPatrickBorgeestsMainFeed();
  goToEditProfileForm();
  editMyBirthday();
  return assertDidNotSubmit();
};

// must be idempotent
exports.cleanup = function () {
  return true;
};

function goToPatrickBorgeestsMainFeed() {
  driver.findElement(By.name('username')).sendKeys('patrick.borgeest@helixdigital.com.au');
  driver.findElement(By.name('password')).sendKeys('password');
  driver.findElement(By.css('form#login-form > input[type="submit"]')).click();
  driver.findElement(By.css('#subnav-create'));
  driver.findElement(By.css('#main-updates .update-column .update-image'));
}

function goToEditProfileForm() {
  driver.findElement(By.css('div#sidebar div#sidebar-search a.user-account span.name')).click();
  driver.findElement(By.css('div#sidebar div#sidebar-scrollarea a#profile-btn')).click();
  driver.findElement(By.css('div#member div.profile-panel ul.profile-panel-menu li.fr a.edit-mode')).click();
}

function editMyBirthday(newbirthday) {
  var personalform;
  personalform = driver.findElement(By.css('div#member-resume ul.editable-information li:nth-child(1) > div:nth-child(3)'));
  personalform.findElement(By.css('div.profile-options a.edit-item')).click();
  personalform.findElement(By.name('dob')).clear();
  personalform.findElement(By.name('dob')).sendKeys(newbirthday);
  personalform.findElement(By.css('a.save-edit')).click();
}

function assertDidNotSubmit() {
  var personalform;
  personalform = driver.findElement(By.css('div#member-resume ul.editable-information li:nth-child(1) > div:nth-child(3)'));
  personalform.getAttribute('class').then(function (classtext) {
    assert.ok(classtext.indexOf('editing') > -1, 'Expected class to include "editing" but erroneously allowed the submit');
  });
  return personalform.findElement(By.css('label.error[for="dob"]')).getText(function (errormessage) {
    assert.equal(errormessage, 'Please enter a birthday in the format YYYY/MM/DD', 'Should display an error message');
  });
}
