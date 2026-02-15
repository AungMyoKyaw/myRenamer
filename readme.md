# myRenamer

> Zawgyi <=> Unicode Renamer - A tool to rename files and folders between Zawgyi and Unicode encodings

[![Build Status][travis]][travis-url]
[![code style: prettier][prettier]][prettier-url]
[![npm][npm-download]][npm-dl-url]
[![contributions welcome][contri]][contri-url]
[![License: MIT][license]][license-url]

## Overview

myRenamer is a Node.js library that helps you convert file and folder names between Zawgyi and Unicode Myanmar text encodings. It uses the [myanmar-tools](https://www.npmjs.com/package/myanmar-tools) package for accurate detection and conversion.

## Installation

```shell
npm install myrenamer
```

## Usage

### CommonJS

```javascript
const myRenamer = require('myrenamer');
const renamer = new myRenamer('/path/to/file-or-folder');
```

### ES Modules / TypeScript

```typescript
import myRenamer from 'myrenamer';
const renamer = new myRenamer('/path/to/file-or-folder');
```

## API

### Constructor

```javascript
new myRenamer(filePath: string)
```

Creates a new myRenamer instance for the specified file or folder path.

### Methods

#### `toZawgyi(option?)`

Converts the file/folder name to Zawgyi encoding.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `option.check` | boolean | false | If true, only converts if the name is detected as Unicode |

```javascript
const file = new myRenamer('~/folder');
file.toZawgyi();
// With check option - only converts if currently Unicode
file.toZawgyi({ check: true });
```

#### `toUnicode(option?)`

Converts the file/folder name to Unicode encoding.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `option.check` | boolean | false | If true, only converts if the name is detected as Zawgyi |

```javascript
const file = new myRenamer('~/folder');
file.toUnicode();
// With check option - only converts if currently Zawgyi
file.toUnicode({ check: true });
```

#### `toggle()`

Automatically detects the current encoding and converts to the opposite:
- Zawgyi names are converted to Unicode
- Unicode names are converted to Zawgyi

```javascript
const file = new myRenamer('~/folder');
file.toggle();
```

### Properties

#### `isZawgyi`

Returns a probability score (0-1) indicating how likely the name is Zawgyi encoded.
- Values closer to 1 indicate Zawgyi encoding
- Values closer to 0 indicate Unicode encoding

```javascript
const file = new myRenamer('~/folder');
const probability = file.isZawgyi;
console.log(probability); // 0.95 (likely Zawgyi) or 0.05 (likely Unicode)
```

## Examples

### Batch convert a folder

```javascript
const fs = require('fs');
const myRenamer = require('myrenamer');

const folder = '/path/to/folder';
const files = fs.readdirSync(folder);

files.forEach(file => {
  const renamer = new myRenamer(`${folder}/${file}`);
  renamer.toUnicode(); // Convert all to Unicode
});
```

### Conditional conversion

```javascript
const myRenamer = require('myrenamer');

const file = new myRenamer('~/document.pdf');
// Only convert if detected as Zawgyi (probability > 0.5)
file.toUnicode({ check: true });
```

## Development

### Prerequisites

- Node.js (see `.travis.yml` for supported versions)
- npm

### Setup

```shell
git clone https://github.com/AungMyoKyaw/myRenamer.git
cd myRenamer
npm install
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run test suite |
| `npm run build` | Compile TypeScript to JavaScript |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## LICENSE

[MIT](LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FAungMyoKyaw%2FmyRenamer.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FAungMyoKyaw%2FmyRenamer?ref=badge_large)

[contri]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square
[contri-url]: https://github.com/AungMyoKyaw/myRenamer/issues
[travis]: https://img.shields.io/travis/AungMyoKyaw/myRenamer/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/AungMyoKyaw/myRenamer
[npm-download]: https://img.shields.io/npm/dt/myrenamer.svg?style=flat-square
[npm-dl-url]: https://www.npmjs.com/package/myrenamer
[license]: https://img.shields.io/badge/License-MIT-brightgreen.svg?style=flat-square
[license-url]: https://opensource.org/licenses/MIT
[prettier]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square
[prettier-url]: https://github.com/prettier/prettier
