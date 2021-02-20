'use strict';

const _extends = Object.assign || function (target) { for (const i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const querystring = require('querystring');
const constants = require('./constants');
const utils = require('./utils');

function sessionCookies(email, password) {
  return makeReqLoginGET().then(function (cookies) {
    return makeReqLoginPOST(email, password, cookies);
  });
}

function makeReqLoginGET() {
  const reqConfig = {
    headers: _extends({}, constants.headers.loginGET),
    responseType: 'text'
  };
  return utils.fetchCookies(constants.urls.login, 'get', reqConfig);
}

function makeReqLoginPOST(email, password, cookies) {
  const csrfParam = utils.trim(cookies.bcookie, '"').split('&')[1];

  const auth = querystring.stringify({
    'session_key': email,
    'session_password': password,
    'isJsEnabled': 'false',
    'loginCsrfParam': csrfParam
  });

  const headers = _extends({}, constants.headers.loginSubmitPOST, {
    cookie: utils.stringifyCookies(cookies)
  });

  const reqConfig = {
    headers: headers,
    maxRedirects: 0,
    validateStatus: validateStatusForURLRedirection,
    data: auth,
    responseType: 'text'
  };

  return utils.fetchCookies(constants.urls.loginSubmit, 'post', reqConfig).then(function (cookieUpdates) {
    return _extends({}, cookies, cookieUpdates);
  });
}

function validateStatusForURLRedirection(status) {
  return status >= 200 && (status < 300 || status === 302);
}

module.exports = {
  sessionCookies: sessionCookies
};