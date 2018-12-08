import fs from 'fs';
import path from 'path';

import myanmarTools from 'myanmar-tools';

const detector = new myanmarTools.ZawgyiDetector();
const converter = new myanmarTools.ZawgyiConverter();

type Option = {
  check?: boolean;
};

class myRenamer {
  private path: string;
  private baseName: string;
  private decisionBoundary: number = 0.5;

  constructor(filePath: string) {
    this.path = filePath;
    this.baseName = path.basename(this.path);
  }

  private getZawgyiProbability(input: string): number {
    const score = detector.getZawgyiProbability(input);
    return score;
  }

  private newZawgyiPath(filePath: string): string {
    let parsedPath = path.parse(filePath);
    delete parsedPath.base;
    parsedPath.name = converter.unicodeToZawgyi(parsedPath.name);
    return path.format(parsedPath);
  }

  private newUnicodePath(filePath: string): string {
    let parsedPath = path.parse(filePath);
    delete parsedPath.base;
    parsedPath.name = converter.zawgyiToUnicode(parsedPath.name);
    return path.format(parsedPath);
  }

  get isZawgyi(): number {
    return this.getZawgyiProbability(this.baseName);
  }

  toZawgyi(option: Option = { check: false }): void {
    const { check } = option;
    let newPath: string = '';
    if (option.check) {
      const score = this.getZawgyiProbability(this.baseName);
      if (score < this.decisionBoundary) {
        newPath = this.newZawgyiPath(this.path);
      } else {
        console.log('SKIP RENAMING TO ZAWGYI');
      }
    } else {
      newPath = this.newZawgyiPath(this.path);
    }

    if (newPath) {
      fs.renameSync(this.path, newPath);
    }
  }

  toUnicode(option: Option = { check: false }): void {
    const { check } = option;
    let newPath: string = '';
    if (option.check) {
      const score = this.getZawgyiProbability(this.baseName);
      if (score > this.decisionBoundary) {
        newPath = this.newUnicodePath(this.path);
      } else {
        console.log('SKIP RENAMING TO UNICODE');
      }
    } else {
      newPath = this.newUnicodePath(this.path);
    }

    if (newPath) {
      fs.renameSync(this.path, newPath);
    }
  }

  toggle(): void {
    const score = this.getZawgyiProbability(this.baseName);
    if (score > this.decisionBoundary) {
      //ZAWGYI=>UNICODE
      this.toUnicode();
    } else {
      //UNICODE=>ZAWGYI
      this.toZawgyi();
    }
  }
}

export default myRenamer;

module.exports = myRenamer;
module.exports.default = myRenamer;
