# myRenamer

> Zawgyi <=> Unicode Renamer

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
