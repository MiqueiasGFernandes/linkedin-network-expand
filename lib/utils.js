'use strict';

const _extends = Object.assign || function (target) { for (const i = 1; i < arguments.length; i++) { const source = arguments[i]; for (const key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const axios = require('axios');
const wordWrap = require('word-wrap');
const moment = require('moment');

function parseToCookieKeyValuePairs(cookieHeaders) {
  return cookieHeaders.reduce(function (keyValuePairs, cookie) {
    const cookieInfo = parseSingleCookie(cookie);
    if (!isDeletedCookie(cookieInfo)) {
      keyValuePairs[cookieInfo.key] = cookieInfo.value;
    }
    return keyValuePairs;
  }, {});
}

function isDeletedCookie(cookieInfo) {
  return cookieInfo.value.indexOf('delete') !== -1;
}

function parseSingleCookie(cookieStr) {
  const cookieInfo = {};
  const parts = cookieStr.split(/; */);

  const pair = parts[0].trim();
  const eqIdx = pair.indexOf('=');
  cookieInfo.key = pair.substr(0, eqIdx).trim();
  cookieInfo.value = pair.substr(eqIdx + 1, pair.length).trim();

  for (const i = 1; i < parts.length; ++i) {
    const partPair = parts[i].trim().split('=');
    if (partPair.length < 2) {
      continue;
    }
    cookieInfo[partPair[0].trim()] = partPair[1].trim();
  }
  return cookieInfo;
}

function stringifyCookies(cookiePairs) {
  return Object.keys(cookiePairs).map(function (cookieName) {
    return cookieName + '=' + cookiePairs[cookieName];
  }).join('; ');
}

function fetchCookies(url, method, config) {
  const reqConfig = _extends({ url: url, method: method }, config);

  return axios.request(reqConfig).then(function (response) {
    return parseToCookieKeyValuePairs(response.headers['set-cookie']);
  });
}

function trim(str, chr) {
  const regex = new RegExp('(?:^' + escapeRegExp(chr) + '+)|(?:' + escapeRegExp(chr) + '+$)', 'g');
  return str.replace(regex, '');
}

function escapeRegExp(str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

const currentPrintStream = process.stderr;

function print(msg) {
  if (global.verbose) {
    currentPrintStream.write(msg);
  }
}

function resolveNewLines(text) {
  text = text || '';
  return text.replace(/[\n\r]+/g, ' ').trim();
}

function wrapText(text, option) {
  option = _extends({
    trim: false
  }, option);

  return wordWrap(text, option);
}

function startTimer() {
  global.startMoment = moment();
}

function endTimer() {
  return moment().diff(global.startMoment, 'second', true) + 'sec';
}

module.exports = {
  fetchCookies: fetchCookies,
  parseToCookieKeyValuePairs: parseToCookieKeyValuePairs,
  stringifyCookies: stringifyCookies,
  trim: trim,
  print: print,
  resolveNewLines: resolveNewLines,
  wrapText: wrapText,
  currentPrintStream: currentPrintStream,
  startTimer: startTimer,
  endTimer: endTimer
};