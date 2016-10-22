/* global localStorage */

function readablizeBytes(bytes) {
  const time = Date.now();
  if (bytes === 0) { return '0 bytes'; }
  const s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const e = Math.floor(Math.log(bytes) / Math.log(1024));
  const result = (bytes / Math.pow(1024, e)).toFixed(2) + ' ' + s[e];
  console.info('readablizeBytes', Date.now() - time);
  return result;
}

function toPercentage(num) {
  return (num * 100).toFixed(2) + '%';
}

const CACHE_KEY = '__WEST_WORLD_HBO__';

let isSupport = null;
function checkSupport() {
  const time = Date.now();
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
  console.info('checkSupport', Date.now() - time);
}

function getUsedSize() {
  const time = Date.now();
  let usedSize = 0;
  const length = localStorage.length;
  for (let i = 0; i < length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    usedSize += (key.length + value.length);
  }
  console.info('getUsedSize', Date.now() - time);
  return usedSize;
}

function getFreeSize() {
  const time = Date.now();
  let freeSize = null;
  // generate a block of string
  let block = Array(1024 * 10).join('s');

  const tryList = [];

  function _tryIncrease() {
    if (block.length < 1) {
      // freeSize = localStorage.getItem(CACHE_KEY).length + CACHE_KEY.length;
      freeSize = tryList.reduce((result, curr) => {
        result += curr;
        return result;
      }, 0);
      // remove added data
      for (let i = 0; i < tryList.length; i++) {
        localStorage.removeItem(CACHE_KEY + i);
      }
      return;
    }
    try {
      let theKey = CACHE_KEY + tryList.length;
      // if less than 20, add to previous cache, because the key has length
      if (block.length > 20) {
        localStorage.setItem(theKey, block);
        tryList.push(theKey.length + block.length);
      } else {
        theKey = CACHE_KEY + (tryList.length - 1); // use previous key
        const theValue = localStorage.getItem(theKey) + block;
        localStorage.setItem(theKey, theValue);
        tryList[tryList.length - 1] = theKey.length + theValue.length;
      }
      _tryIncrease();
    } catch (e) {
      block = Array(Math.ceil(block.length / 2)).join('s');
      _tryIncrease();
    }
  }

  _tryIncrease();

  localStorage.removeItem(CACHE_KEY);
  console.info('getFreeSize', Date.now() - time);
  return freeSize;
}

function getInfo() {
  if (isSupport == null) {
    checkSupport();
  }
  if (!isSupport) {
    return {
      support: false,
    };
  }

  const usedSize = getUsedSize();

  const freeSize = getFreeSize();

  const size = usedSize + freeSize;

  return {
    support: isSupport,
    size,
    humanSize: readablizeBytes(size),
    usedSize,
    humanUsedSize: readablizeBytes(usedSize),
    usedPercentage: toPercentage(usedSize / size),
    freeSize,
    humanFreeSize: readablizeBytes(freeSize),
    freePercentage: toPercentage(freeSize / size),
  };
}

export default { getInfo, getUsedSize, getFreeSize };
export { getInfo, getUsedSize, getFreeSize };
