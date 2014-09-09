var assert = require('assert');

exports.run = function (webdriver, driver) {
  var By = webdriver.By,
    Enter = webdriver.Key.RETURN,
  unfollowelement;
  console.log('running com109_test');

  driver.get('http://comet.paddy');
  driver.findElement(By.name("username")).sendKeys("patrick.borgeest@helixdigital.com.au");
  driver.findElement(By.name("password")).sendKeys("password");
  driver.findElement(By.css('form#login-form > input[type="submit"]')).click();
  driver.findElement(By.css('#subnav-create'));
  driver.findElement(By.css('#main-updates .update-column .update-image'));
  driver.executeScript(goToJaysProfile);
  driver.findElement(By.css('#member > div.profile-panel > ul.profile-panel-menu > li > a[href="/member/26/followers"]')).click();
  driver.findElement(By.css('#member-followers div.follow-user[data-profile-id="52"]'))
    .then(function (followers) {
      return followers.getInnerHtml();
    })
    .then(function (innerhtml) {
      if (innerhtml.indexOf('/unfollow/52') > -1) {
        unfollowJohnSung(driver);
      }
    });
  driver.findElement(By.css('#member-followers > div.follow-user > a[href="/follow/52"]')).click();
  unfollowelement = driver.findElement(By.css('#member-followers > div.follow-user > a[href="/unfollow/52"]'));
  assert(unfollowelement);

  return true;
}


// must be idempotent
exports.cleanup = function (webdriver, driver) {
  unfollowJohnSung(driver);
}

function unfollowJohnSung(driver) {
  driver.executeScript(function () {
    window.cl.follows._handleFollowButtonClick({preventDefault: function () {}, stopPropagation: function () {}, currentTarget: $('<a href="/unfollow/52">')});
  });
}

function goToJaysProfile() {
    window.cl.member.showResume(26);
}
