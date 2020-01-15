const { Then } = require('cucumber');
const { cookies } = require('../../actions');

Then('I set cookie {string} as {}', cookies.setCookie);

Then('I check cookie {string} should have value {}', cookies.getCookie);

Then('I delete cookie {string}', cookies.deleteCookie);

Then('I set following cookies:', cookies.setCookies);

Then('I check following cookies:', cookies.getCookies);

Then('I delete following cookies:', cookies.deleteCookies);
