/*jslint unparam: true, nomen: true */
/*global window, $ */
"use strict";

var By, webdriver, driver, followingOnAMember, followingOnAPage, goToJaysProfile,
  goToFuelsProfile, unfollowJohnSung, unfollowLinden;

exports.run = function (inwebdriver, indriver) {
  webdriver = inwebdriver;
  driver = indriver;
  By = webdriver.By;

  driver.get('http://comet.paddy')
    .then(function () {console.log('Running COMS-109_test'); });
  driver.findElement(By.name("username")).sendKeys("patrick.borgeest@helixdigital.com.au");
  driver.findElement(By.name("password")).sendKeys("password");
  driver.findElement(By.css('form#login-form > input[type="submit"]')).click();
  driver.findElement(By.css('#subnav-create'));
  driver.findElement(By.css('#main-updates .update-column .update-image'));

  followingOnAMember();
  followingOnAPage();
  return true;
};

function followingOnAMember() {
  driver.executeScript(goToJaysProfile)
    .then(function () {console.log('  - Testing a member'); });
  driver.findElement(By.css('#member > div.profile-panel > ul.profile-panel-menu > li > a[href="/member/26/feed"]')).click();
  driver.findElement(By.css('#member > div.profile-panel > ul.profile-panel-menu > li > a[href="/member/26/followers"]')).click();
  driver.findElement(By.css('#member-followers div.follow-user[data-profile-id="52"]'))
    .then(function (followers) {
      return followers.getInnerHtml();
    })
    .then(function (innerhtml) {
      if (innerhtml.indexOf('/unfollow/52') > -1) {
        unfollowJohnSung(driver);
        driver.executeScript(goToJaysProfile);
        driver.findElement(By.css('#member > div.profile-panel > ul.profile-panel-menu > li > a[href="/member/26/feed"]')).click();
        driver.findElement(By.css('#member > div.profile-panel > ul.profile-panel-menu > li > a[href="/member/26/followers"]')).click();
      }
    });
  driver.findElement(By.css('#member-followers > div.follow-user > a[href="/follow/52"]')).click();
  driver.findElement(By.css('#member-followers > div.follow-user > a[href="/unfollow/52"]'));
}

function followingOnAPage() {
  driver.executeScript(goToFuelsProfile)
    .then(function () {console.log('  - Testing a page'); });
  driver.findElement(By.css('#employer > div.profile-panel > ul.profile-panel-menu > li > a[href="/page/4994/feed"]')).click();
  driver.findElement(By.css('#employer > div.profile-panel > ul.profile-panel-menu > li > a[href="/page/4994/followers"]')).click();
  driver.findElement(By.css('#page-followers div.follow-user[data-profile-id="6330"]'))
    .then(function (followers) {
      return followers.getInnerHtml();
    })
    .then(function (innerhtml) {
      if (innerhtml.indexOf('/unfollow/6330') > -1) {
        unfollowLinden(driver);
        driver.executeScript(goToFuelsProfile);
        driver.findElement(By.css('#employer > div.profile-panel > ul.profile-panel-menu > li > a[href="/page/4994/feed"]')).click();
        driver.findElement(By.css('#employer > div.profile-panel > ul.profile-panel-menu > li > a[href="/page/4994/followers"]')).click();
      }
    });
  driver.findElement(By.css('#page-followers > div.follow-user > a[href="/follow/6330"]')).click();
  driver.findElement(By.css('#page-followers > div.follow-user > a[href="/unfollow/6330"]'));
}

// must be idempotent
exports.cleanup = function (inwebdriver, indriver) {
  unfollowJohnSung(indriver);
  unfollowLinden(indriver);
};

function unfollowJohnSung(driver) {
  driver.executeScript(function () {
    window.cl.follows._handleFollowButtonClick({preventDefault: function () {return true; }, stopPropagation: function () {return true; }, currentTarget: $('<a href="/unfollow/52">')});
  });
}

function unfollowLinden(driver) {
  driver.executeScript(function () {
    window.cl.follows._handleFollowButtonClick({preventDefault: function () {return true; }, stopPropagation: function () {return true; }, currentTarget: $('<a href="/unfollow/6330">')});
  });
}

function goToJaysProfile() {
  window.cl.member.showResume(26);
}

function goToFuelsProfile() {
  window.cl.employer.show(4994);
}
