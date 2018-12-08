# myRenamer

> Zawgyi <=> Unicode Renamer

[![Build Status][travis]][travis-url]
[![code style: prettier][prettier]][prettier-url]
[![npm][npm-download]][npm-dl-url]
[![contributions welcome][contri]][contri-url]
[![License: MIT][license]][license-url]

## Installation

```shell
npm install myrenamer
```

## API

- [toZawgyi](#toZawgyi)
- [toUnicode](#toUnicode)

### toZawgyi

```javascript
const myRenamer = require('myrenamer');
const folder = new myRenamer('~/folder');
const file = new myRenamer('~/file');
folder.toZawgyi();
file.toZawgyi();
```

### toUnicode

```javascript
const myRenamer = require('myrenamer');
const folder = new myRenamer('~/folder');
const file = new myRenamer('~/file');
folder.toUnicode();
file.toUnicode();
```

## LICENSE

[MIT](./LICENSE)

[contri]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square
[contri-url]: https://github.com/AungMyoKyaw/myRenamer/issues
[travis]: https://img.shields.io/travis/AungMyoKyaw/myRenamer/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/AungMyoKyaw/myRenamer
[npm-download]: https://img.shields.io/npm/dt/mynum.svg?style=flat-square
[npm-dl-url]: https://www.npmjs.com/package/myrenamer
[license]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[prettier]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
