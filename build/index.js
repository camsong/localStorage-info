'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* global localStorage */

function readablizeBytes(bytes) {
  var time = Date.now();
  if (bytes === 0) {
    return '0 bytes';
  }
  var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  var e = Math.floor(Math.log(bytes) / Math.log(1024));
  var result = (bytes / Math.pow(1024, e)).toFixed(2) + ' ' + s[e];

  return result;
}

function toPercentage(num) {
  return (num * 100).toFixed(2) + '%';
}

var CACHE_KEY = '__WEST_WORLD_HBO__';

var isSupport = null;
function checkSupport() {
  var time = Date.now();
  try {
    localStorage.setItem(CACHE_KEY, CACHE_KEY);
    if (localStorage.getItem(CACHE_KEY) !== CACHE_KEY) {
      localStorage.disabled = true;
    }
    localStorage.removeItem(CACHE_KEY);
    isSupport = true;
  } catch (e) {
    isSupport = false;
  }
}

function getUsedSize() {
  var time = Date.now();
  var usedSize = 0;
  var length = localStorage.length;
  for (var i = 0; i < length; i++) {
    var key = localStorage.key(i);
    var value = localStorage.getItem(key);
    usedSize += key.length + value.length;
  }

  return usedSize;
}

function getFreeSize() {
  var time = Date.now();
  var freeSize = null;
  // generate 2M length of string
  var block = Array(1024 * 1024 * 1).join('s');
  localStorage.setItem(CACHE_KEY, block);

  function _tryIncrease() {
    if (block.length < 1) {
      freeSize = localStorage.getItem(CACHE_KEY).length + CACHE_KEY.length;
      return;
    }
    try {
      localStorage.setItem(CACHE_KEY, localStorage.getItem(CACHE_KEY) + block);

      _tryIncrease();
    } catch (e) {
      block = Array(Math.floor(block.length / 2)).join('x');
      _tryIncrease();
    }
  }

  _tryIncrease();

  localStorage.removeItem(CACHE_KEY);

  return freeSize;
}

function getInfo() {
  if (isSupport == null) {
    checkSupport();
  }
  if (!isSupport) {
    return {
      support: false
    };
  }

  var usedSize = getUsedSize();

  var freeSize = getFreeSize();

  var size = usedSize + freeSize;

  return {
    support: isSupport,
    size: size,
    humanSize: readablizeBytes(size),
    usedSize: usedSize,
    humanUsedSize: readablizeBytes(usedSize),
    usedPercentage: toPercentage(usedSize / size),
    freeSize: freeSize,
    humanFreeSize: readablizeBytes(freeSize),
    freePercentage: toPercentage(freeSize / size)
  };
}

exports.default = { getInfo: getInfo, getUsedSize: getUsedSize, getFreeSize: getFreeSize };
exports.getInfo = getInfo;
exports.getUsedSize = getUsedSize;
exports.getFreeSize = getFreeSize;