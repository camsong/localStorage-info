# localStorage Info [![Build Status](https://travis-ci.org/camsong/localStorage-info.svg)](https://travis-ci.org/camsong/localStorage-info) [![npm version](https://badge.fury.io/js/localStorage-info.svg)](http://badge.fury.io/js/localStorage-info) [![Coverage Status](https://coveralls.io/repos/github/camsong/localStorage-info/badge.svg?branch=master)](https://coveralls.io/github/camsong/localStorage-info?branch=master)

Get to know localStorage size & more

## Installation

Install via NPM or yarn:

```
npm i localStorage-info
```

## Usage
```
import { getInfo } from 'localStorage-info';
console.log(getInfo());
```

The output is like:
```js
{
  support: true,            // support localStorage
  size: 5242880,            // full size in bytes
  humanSize: '5.00 MB',     // full size in human readable format
  usedSize: 1703936,        // used size in bytes
  humanUsedSize: '1.63 MB', // used size in human readable format
  usedPercentage: '32.50%', // percentage of used size
  freeSize: 3538944,        // free size in bytes
  humanFreeSize: '3.38 MB', // free size in human readable format
  freePercentage: '67.50%'  // percentage of free size
}
```

The size of latest version of Chrome and Firefox are approximately `5 MB`, Safari is `2.5 MB`, but that's not quite accurate, such as Firefox 31 size is `5242975 bytes`, while Firefox 38 is `5242880 bytes`

## Caveats:

This library get localStorage size by adding data in localStorage, so it may be slow, usually **0.1 second** to run. So you may not use it in crucial application.

## License

MIT
