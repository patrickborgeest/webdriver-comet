/*global window */
"use strict";

var assert = require('assert'), webdriver, driver, By,
  setBirthdayInSignup, setBirthdayInConfirmation, setBirthdayInResume,
  assumingAlreadyLoggedInThenLogOut, signupNewUser, enterContactDetails,
  skipPastProfilePicture, logout,
  dlay = function (ms) { return webdriver.promise.delayed(ms); };

exports.run = function (inwebdriver, indriver) {
  webdriver = inwebdriver;
  driver = indriver;
  By = webdriver.By;

  setBirthdayInSignup();
  setBirthdayInConfirmation();
  return setBirthdayInResume();

};

function setBirthdayInSignup() {
  var randomname = Math.random().toString(36).substring(2, 8),
    randomemail = randomname + '@example.com',
    signupform,
    resume;

  driver.get('http://comet.paddy')
    .then(function () { console.log('Running COMS-114_test'); return this; })
    .then(function () { console.log('  - Set birthday in signup'); return this; });

  assumingAlreadyLoggedInThenLogOut(driver);
  signupNewUser(randomname, randomemail, {day: '10', month: '10', year: '1989'});

// CONFIRM
  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding form#signup-form')).isDisplayed();
    },
    7000,
    'Timed out waiting for onboarding'
  );

  signupform = driver.findElement(By.css('div#onboarding form#signup-form'));
  signupform.findElement(By.name('day')).getAttribute('value').then(function (thisday) { assert.equal(thisday, '10', 'should be 10th day'); });
  signupform.findElement(By.name('month')).getAttribute('value').then(function (thismonth) { assert.equal(thismonth, '10', 'should be 10th month'); });
  signupform.findElement(By.name('year')).getAttribute('value').then(function (thisyear) { assert.equal(thisyear, '1989', 'should be 1989th year'); });

  signupform.findElement(By.name('tandc')).click();
  driver.findElement(By.css('div#onboarding-steps a.help-next')).click();

  enterContactDetails();
  skipPastProfilePicture();

// MEMBER RESUME
  driver.wait(
    function () {
      return driver.findElement(By.css('div#member div#member-resume')).isDisplayed();
    },
    7000,
    'Timed out waiting for profile picture'
  );
  resume = driver.findElement(By.css('div#member div#member-resume'));
  resume.findElement(By.name('dob')).getAttribute('value').then(function (thisdob) { assert.equal(thisdob, '1989/10/10', 'should be 1989/10/10'); });
  resume.findElement(By.css('form[action="profile/personal"] a.cancel-edit')).click();

  resume.findElement(By.css('span[data-field="dob"]')).getText().then(function (age) { assert.equal(age, 24, 'Age should be 24 but was ' + age); });

}



function setBirthdayInConfirmation() {
  var randomname = Math.random().toString(36).substring(2, 8),
    randomemail = randomname + '@example.com',
    signupform,
    resume;

  logout().then(function () { console.log('  - Set birthday in confirmation'); });
  driver.sleep(4000);  // the wait below doesn't work. Hard-code a wait instead.
  driver.wait(
    function () {
      return driver.findElement(By.css('a[href="#sign-up"]')).isDisplayed();
    },
    7000,
    'Timed out waiting for sign-up link'
  );

  signupNewUser(randomname, randomemail, {day: '10', month: '10', year: '1989'});

// CONFIRM
  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding form#signup-form')).isDisplayed();
    },
    7000,
    'Timed out waiting for onboarding'
  );

  signupform = driver.findElement(By.css('div#onboarding form#signup-form'));
  signupform.findElement(By.name('day')).getAttribute('value').then(function (thisday) { assert.equal(thisday, '10', 'should be 10th day'); });
  signupform.findElement(By.name('month')).getAttribute('value').then(function (thismonth) { assert.equal(thismonth, '10', 'should be 10th month'); });
  signupform.findElement(By.name('year')).getAttribute('value').then(function (thisyear) { assert.equal(thisyear, '1989', 'should be 1989th year'); });

  signupform.findElement(By.name('year')).clear().then(function () {
    signupform.findElement(By.name('year')).sendKeys('1927');
  });

  signupform.findElement(By.name('tandc')).click();
  driver.findElement(By.css('div#onboarding-steps a.help-next')).click();

  enterContactDetails();
  skipPastProfilePicture();

// MEMBER RESUME
  driver.wait(
    function () {
      return driver.findElement(By.css('div#member div#member-resume')).isDisplayed();
    },
    7000,
    'Timed out waiting for profile picture'
  );
  resume = driver.findElement(By.css('div#member div#member-resume'));
  resume.findElement(By.name('dob')).getAttribute('value').then(function (thisdob) { assert.equal(thisdob, '1927/10/10', 'should be 1927/10/10 but was ' + thisdob); });
  resume.findElement(By.css('form[action="profile/personal"] a.cancel-edit')).click();

  resume.findElement(By.css('span[data-field="dob"]')).getText().then(function (age) { assert.equal(age, 86, 'Age should be 86 but was ' + age); });

}

function setBirthdayInResume() {
  var randomname = Math.random().toString(36).substring(2, 8),
    randomemail = randomname + '@example.com',
    signupform,
    resume,
    ageToChangeTo = 102;

  driver.executeScript(function () { if (window.cl.logout) { window.cl.logout(); } })
    .then(function () { console.log('  - Set birthday in resumé'); });
  driver.sleep(4000);  // the wait below doesn't work. Hard-code a wait instead.
  driver.wait(
    function () {
      return driver.findElement(By.css('a[href="#sign-up"]')).isDisplayed();
    },
    7000,
    'Timed out waiting for sign-up link'
  );

  signupNewUser(randomname, randomemail, {day: '10', month: '10', year: '1989'});

// CONFIRM
  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding form#signup-form')).isDisplayed();
    },
    7000,
    'Timed out waiting for onboarding'
  );

  signupform = driver.findElement(By.css('div#onboarding form#signup-form'));
  signupform.findElement(By.name('day')).getAttribute('value').then(function (thisday) { assert.equal(thisday, '10', 'should be 10th day'); });
  signupform.findElement(By.name('month')).getAttribute('value').then(function (thismonth) { assert.equal(thismonth, '10', 'should be 10th month'); });
  signupform.findElement(By.name('year')).getAttribute('value').then(function (thisyear) { assert.equal(thisyear, '1989', 'should be 1989th year'); });

  signupform.findElement(By.name('tandc')).click();
  driver.findElement(By.css('div#onboarding-steps a.help-next')).click();

  enterContactDetails();
  skipPastProfilePicture();

// MEMBER RESUME
  driver.wait(
    function () {
      return driver.findElement(By.css('div#member div#member-resume')).isDisplayed();
    },
    7000,
    'Timed out waiting for profile picture'
  );
  resume = driver.findElement(By.css('div#member div#member-resume'));
  resume.findElement(By.name('dob')).getAttribute('value').then(function (thisdob) { assert.equal(thisdob, '1989/10/10', 'should be 1989/10/10 but was ' + thisdob); });
  resume.findElement(By.name('dob')).clear().then(function () {
    var birthyear = (new Date()).getFullYear() - ageToChangeTo;
    resume.findElement(By.name('dob')).sendKeys(birthyear + '/01/01');
    resume.findElement(By.name('information')).sendKeys('About Me Blah');
  });
  resume.findElement(By.css('form[action="profile/personal"] a.save-edit')).click();

  return resume.findElement(By.css('span[data-field="dob"]')).getText().then(function (age) { assert.equal(age, ageToChangeTo, 'Age should be ' + ageToChangeTo + ' but was ' + age); });

}


function assumingAlreadyLoggedInThenLogOut(driver) {
  driver.findElement(By.css('li#subnav-create a[href="#create"]'));
  driver.executeScript(function () { if (window.cl.logout) { window.cl.logout(); } });
  driver.sleep(4000);  // the wait below doesn't work. Hard-code a wait instead.
  driver.wait(
    function () {
      return driver.findElement(By.css('a[href="#sign-up"]')).isDisplayed();
    },
    7000,
    'Timed out waiting for sign-up link'
  );
}


function signupNewUser(username, useremail, userbirthday) {
  driver.findElement(By.css('a[href="#sign-up"]')).click();
  driver.findElement(By.css('form#signup-form input[name="name"]'))
    .then(function (name) { name.sendKeys(username); return dlay(200); })
    .then(function () {
      return driver.findElement(By.css('form#signup-form input[name="surname"]'));
    }).then(function (surname) { surname.sendKeys(username); })
    .then(function () {
      return driver.findElement(By.css('form#signup-form input[name="ConfirmEmail"]'));
    }).then(function (confirm) { confirm.sendKeys(useremail); })
    .then(function () {
      return driver.findElement(By.css('form#signup-form input[name="Day"]'));
    }).then(function (day) { day.sendKeys(userbirthday.day); })
    .then(function () {
      return driver.findElement(By.css('form#signup-form input[name="Month"]'));
    }).then(function (month) { month.sendKeys(userbirthday.month); })
    .then(function () {
      return driver.findElement(By.css('form#signup-form input[name="Year"]'));
    }).then(function (year) { year.sendKeys(userbirthday.year); })
    .then(function () {
      return driver.findElement(By.css('form#signup-form input[name="Email"]'));
    }).then(function (email) { email.sendKeys(useremail); })
    .then(function () {
      return driver.findElement(By.name("NewPassword"));
    }).then(function (password) { password.sendKeys("password"); })
    .then(function () {
      driver.findElement(By.css('div#sign-up form#signup-form div input#tandc')).click();
    }).then(function () {
      driver.findElement(By.css('form#signup-form input[type="submit"]')).click();
    });
}


function enterContactDetails() {
  var contactform, selectbuildingname;

  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding form#signup-contact')).isDisplayed();
    },
    7000,
    'Timed out waiting for contact form'
  );

  contactform = driver.findElement(By.css('div#onboarding form#signup-contact'));
  contactform.findElement(By.name('phonemobile')).sendKeys('0421 355 407');
  contactform.findElement(By.name('address')).sendKeys('22 Cecil Place Prahran VIC 3181');

  selectbuildingname = contactform.findElement(By.name('building_name'));
  selectbuildingname.click();
  selectbuildingname.findElement(By.css('option[value="work"]')).click();

  driver.findElement(By.css('div#onboarding-steps a.help-next')).click();
}


function skipPastProfilePicture() {
// PROFILE PICTURE
  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding div#onboarding-profile-picture')).isDisplayed();
    },
    7000,
    'Timed out waiting for profile picture'
  );
  driver.findElement(By.css('div#onboarding-steps a.help-next')).click();
}


function logout() {
  return driver.executeScript(function () { if (window.cl.logout) { window.cl.logout(); } });
}

exports.cleanup = function () {
  logout();
};

