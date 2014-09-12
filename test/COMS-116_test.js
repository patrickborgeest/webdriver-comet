/*global window */
"use strict";

var assert = require('assert'), webdriver, driver, By,
  assumingAlreadyLoggedInThenLogOut, signupNewUser, enterContactDetails,
  skipPastProfilePicture, skipPastMemberResume, logout,
  clickHelpOverlayNext, clickHelpOverlayDone,
  clickGotIt, fillOnboardingConfirm, selectOneVillage,
  selectOneFollow, signupNewPageWithEmptyWebsiteAndWithName,
  skipPastPageProfilePicture, skipPastEmployerTools,
  assertThatThereIsAPageCalled, clickCreateAPage,
  addPageFromOnboarding, addPageFromSidebar,
  dlay = function (ms) { return webdriver.promise.delayed(ms); };

exports.run = function (inwebdriver, indriver) {

  var randomname = Math.random().toString(36).substring(2, 8);

  webdriver = inwebdriver;
  driver = indriver;
  By = webdriver.By;

  driver.get('http://comet.paddy')
    .then(function () { console.log('Running COMS-116_test'); return this; });
  addPageFromOnboarding(randomname);
  addPageFromSidebar(randomname);
};

function addPageFromOnboarding(randomname) {
  var randomemail = randomname + '@example.com',
    birthday = {day: '10', month: '10', year: '1989'};

  driver.get('http://comet.paddy')
    .then(function () { console.log('  - From onboarding'); return this; });
  assumingAlreadyLoggedInThenLogOut(driver);
  signupNewUser(randomname, randomemail, birthday);
  clickGotIt();
  fillOnboardingConfirm(birthday);
  enterContactDetails();
  skipPastProfilePicture();
  skipPastMemberResume();
  selectOneVillage('65');
  selectOneFollow('660');
  clickHelpOverlayNext();
  clickGotIt();
  signupNewPageWithEmptyWebsiteAndWithName('A ' + randomname + ' Page');
  skipPastPageProfilePicture();
  skipPastEmployerTools();
  selectOneVillage('39');
  selectOneFollow('53');
  clickHelpOverlayDone();

  assertThatThereIsAPageCalled('A ' + randomname + ' Page');
}


function addPageFromSidebar(randomname) {

  driver.get('http://comet.paddy')
    .then(function () { console.log('  - From sidebar'); return this; });
  clickCreateAPage();
  signupNewPageWithEmptyWebsiteAndWithName('Another ' + randomname + ' Page');
  skipPastPageProfilePicture();
  skipPastEmployerTools();
  selectOneVillage('39');
  selectOneFollow('53');
  clickHelpOverlayDone();

  assertThatThereIsAPageCalled('Another ' + randomname + ' Page');
}

function clickCreateAPage() {
  driver.findElement(By.css('a[href="/page/new"]')).click();
}

function clickHelpOverlayNext() {
  driver.findElement(By.css('div#onboarding-steps a.help-next')).click();
}

function clickHelpOverlayDone() {
  driver.findElement(By.css('div#onboarding-steps a.help-done')).click();
}


function assumingAlreadyLoggedInThenLogOut(driver) {
  driver.findElement(By.css('li#subnav-create a[href="#create"]'));
  logout();
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
      driver.findElement(By.css('div#sign-up form#signup-form div input#createPage')).click();
    }).then(function () {
      driver.findElement(By.css('form#signup-form input[type="submit"]')).click();
    });
}

function clickGotIt() {
// CONFIRM
  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding-steps a.help-gotit')).isDisplayed();
    },
    7000,
    'Timed out waiting for "Got it"'
  );
  driver.findElement(By.css('div#onboarding-steps > a.help-gotit')).click();
}

function fillOnboardingConfirm(birthday) {
  var signupform;
  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding form#signup-form')).isDisplayed();
    },
    7000,
    'Timed out waiting for onboarding'
  );

  signupform = driver.findElement(By.css('div#onboarding form#signup-form'));
  signupform.findElement(By.name('day')).getAttribute('value').then(function (thisday) { assert.equal(thisday, birthday.day, 'should be ' + birthday.day + 'th day'); });
  signupform.findElement(By.name('month')).getAttribute('value').then(function (thismonth) { assert.equal(thismonth, birthday.month, 'should be ' + birthday.month + 'th month'); });
  signupform.findElement(By.name('year')).getAttribute('value').then(function (thisyear) { assert.equal(thisyear, birthday.year, 'should be ' + birthday.year + 'th year'); });

  signupform.findElement(By.name('tandc')).click();
  clickHelpOverlayNext();
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

  clickHelpOverlayNext();
}


function skipPastProfilePicture() {
  driver.wait(
    function () {
      return driver.findElement(By.css('div#onboarding div#onboarding-profile-picture')).isDisplayed();
    },
    7000,
    'Timed out waiting for profile picture'
  );
  clickHelpOverlayNext();
}

function skipPastPageProfilePicture() {
  driver.wait(
    function () {
      return driver.findElement(By.id('onboarding-page-profile-picture')).isDisplayed();
    },
    7000,
    'Timed out waiting for profile picture'
  );
  clickHelpOverlayNext();
}


function skipPastMemberResume() {
  driver.wait(
    function () {
      return driver.findElement(By.css('div#member div#member-resume')).isDisplayed();
    },
    7000,
    'Timed out waiting for member resume'
  );
  driver.findElement(By.css('form[action="profile/personal"] a.cancel-edit')).click();
  clickHelpOverlayNext();
}

function selectOneVillage(village_id) {
  driver.wait(
    function () {
      return driver.findElement(By.id('villages')).isDisplayed();
    },
    7000,
    'Timed out waiting for villages'
  );
  driver.findElement(By.css('div#villages a#join-' + village_id)).click();
  clickHelpOverlayNext();
}

function selectOneFollow(profile_id) {
  driver.wait(
    function () {
      return driver.findElement(By.id('top-follows')).isDisplayed();
    },
    7000,
    'Timed out waiting for follows'
  );
  driver.findElement(By.css('div#top-follows div[data-profile-id="' + profile_id + '"] a.btn')).click();
}

function signupNewPageWithEmptyWebsiteAndWithName(newname) {
  var pageform, category, subcategory;
  driver.wait(
    function () {
      return driver.findElement(By.id('create-page-form')).isDisplayed();
    },
    7000,
    'Timed out waiting for follows'
  );
  pageform = driver.findElement(By.id('create-page-form'));
  category = pageform.findElement(By.id('onboarding-business-category'));
  category.click();
  pageform.findElement(By.name('page-name')).sendKeys(newname);
  pageform.findElement(By.name('tandc')).click();
  category.findElement(By.css('option[value="102"]')).click();
  pageform.findElement(By.name('description')).sendKeys('This is the new page');
  subcategory = pageform.findElement(By.name('page-subcategory'));
  subcategory.click();
  subcategory.findElement(By.css('option[value="203"]')).click();
  clickHelpOverlayNext();
}


function skipPastEmployerTools() {
  driver.wait(
    function () {
      return driver.findElement(By.id('onboarding-tools')).isDisplayed();
    },
    7000,
    'Timed out waiting for employer tools'
  );
  clickHelpOverlayNext();
}

function assertThatThereIsAPageCalled(testpagename) {
  var namestrongs, names, sidebar_search,
    foundpage = false,
    flow = webdriver.promise.controlFlow();

  flow.execute(function () { return webdriver.promise.delayed(8000); });
  flow.execute(function () {
    sidebar_search = driver.findElement(By.id('sidebar-search'));
    return sidebar_search;
  });
  flow.execute(function () {
    return sidebar_search.findElement(By.css('a.user-account span.icon-down')).click();
  });
  flow.execute(function () { return webdriver.promise.delayed(2000); });
  flow.execute(function () {
    namestrongs = driver.findElements(By.css('#sidebar-scrollarea ul.accounts li.profile-bar a.user-account span.name strong'));
    names = namestrongs.then(function (elements) {
      return elements.map(function (element) {
        return element.getText();
      });
    });
    return names;
  });
  flow.execute(function () {
    webdriver.promise.fullyResolved(names).then(function (profilenames) {
      profilenames.forEach(function (thisname) {
        if (thisname === testpagename) {
          foundpage = true;
        }
      });
      assert.ok(foundpage, 'Expected to find ' + testpagename + ' in ' + profilenames);
    });
  });
}


function logout() {
  return driver.executeScript(function () { if (window.cl) { window.cl.logout(); } });
}

exports.cleanup = function () {
  logout();
};

