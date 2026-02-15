import MyRenamer from '../src/';
import * as assert from 'assert';
import fs from 'fs';
import path from 'path';

import 'mocha';

const TEST_DIR = path.join(process.cwd(), 'test', 'file');

// Test data
const zawgyiSample = 'ဗမာျပည္သည္တို႔ျပည္';
const unicodeSample = 'ဗမာပြည်သည်တို့ပြည်';

/**
 * Helper to generate unique test names
 */
function generateUniqueName(base: string): string {
  return `${base}${Math.floor(Math.random() * 1e10)}`;
}

/**
 * Helper to ensure test directory exists
 */
function ensureTestDir(): void {
  if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
  }
}

/**
 * Helper to clean up test files after tests
 */
function cleanupTestFiles(): void {
  if (fs.existsSync(TEST_DIR)) {
    const files = fs.readdirSync(TEST_DIR);
    files.forEach((file) => {
      const filePath = path.join(TEST_DIR, file);
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmdirSync(filePath, { recursive: true });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
}

describe('MyRenamer', () => {
  describe('Constructor', () => {
    it('should create instance with valid path', () => {
      const renamer = new MyRenamer('/valid/path');
      assert.strictEqual(renamer.originalPath, '/valid/path');
    });

    it('should throw error with empty path', () => {
      assert.throws(
        () => new MyRenamer(''),
        /File path cannot be empty/
      );
    });

    it('should throw error with whitespace-only path', () => {
      assert.throws(
        () => new MyRenamer('   '),
        /File path cannot be empty/
      );
    });
  });

  describe('Properties', () => {
    it('should return original path', () => {
      const renamer = new MyRenamer('/test/file.txt');
      assert.strictEqual(renamer.originalPath, '/test/file.txt');
    });

    it('should return base name', () => {
      const renamer = new MyRenamer('/test/file.txt');
      assert.strictEqual(renamer.name, 'file.txt');
    });
  });

  describe('isZawgyi', () => {
    it('should return high probability for Zawgyi text', () => {
      const renamer = new MyRenamer(`/test/${zawgyiSample}.txt`);
      const probability = renamer.isZawgyi;
      assert.ok(probability > 0.5, `Expected probability > 0.5, got ${probability}`);
    });

    it('should return low probability for Unicode text', () => {
      const renamer = new MyRenamer(`/test/${unicodeSample}.txt`);
      const probability = renamer.isZawgyi;
      assert.ok(probability < 0.5, `Expected probability < 0.5, got ${probability}`);
    });
  });

  describe('toZawgyi', () => {
    let unicodeName: string;

    before(() => {
      ensureTestDir();
      unicodeName = generateUniqueName(unicodeSample);
      fs.writeFileSync(path.join(TEST_DIR, `${unicodeName}.txt`), '', 'utf8');
    });

    after(cleanupTestFiles);

    it('should rename Unicode file to Zawgyi', () => {
      const filePath = path.join(TEST_DIR, `${unicodeName}.txt`);
      const renamer = new MyRenamer(filePath);
      const result = renamer.toZawgyi();

      assert.strictEqual(result.renamed, true);
      assert.strictEqual(result.originalPath, filePath);
      assert.ok(result.newPath);
    });

    it('should skip renaming with check option when already Zawgyi', () => {
      const filePath = path.join(TEST_DIR, `${zawgyiSample}.txt`);
      fs.writeFileSync(filePath, '', 'utf8');

      const renamer = new MyRenamer(filePath);
      const result = renamer.toZawgyi({ check: true });

      assert.strictEqual(result.renamed, false);
      assert.ok(result.reason);
    });
  });

  describe('toUnicode', () => {
    let zawgyiName: string;

    before(() => {
      ensureTestDir();
      zawgyiName = generateUniqueName(zawgyiSample);
      fs.writeFileSync(path.join(TEST_DIR, `${zawgyiName}.txt`), '', 'utf8');
    });

    after(cleanupTestFiles);

    it('should rename Zawgyi file to Unicode', () => {
      const filePath = path.join(TEST_DIR, `${zawgyiName}.txt`);
      const renamer = new MyRenamer(filePath);
      const result = renamer.toUnicode();

      assert.strictEqual(result.renamed, true);
      assert.strictEqual(result.originalPath, filePath);
      assert.ok(result.newPath);
    });

    it('should skip renaming with check option when already Unicode', () => {
      const filePath = path.join(TEST_DIR, `${unicodeSample}.txt`);
      fs.writeFileSync(filePath, '', 'utf8');

      const renamer = new MyRenamer(filePath);
      const result = renamer.toUnicode({ check: true });

      assert.strictEqual(result.renamed, false);
      assert.ok(result.reason);
    });
  });

  describe('toggle', () => {
    let zawgyiName: string;
    let unicodeName: string;

    before(() => {
      ensureTestDir();
      zawgyiName = generateUniqueName(zawgyiSample);
      unicodeName = generateUniqueName(unicodeSample);
      fs.writeFileSync(path.join(TEST_DIR, `${zawgyiName}.txt`), '', 'utf8');
      fs.writeFileSync(path.join(TEST_DIR, `${unicodeName}.txt`), '', 'utf8');
    });

    after(cleanupTestFiles);

    it('should convert Zawgyi to Unicode when toggling', () => {
      const filePath = path.join(TEST_DIR, `${zawgyiName}.txt`);
      const renamer = new MyRenamer(filePath);
      const result = renamer.toggle();

      assert.strictEqual(result.renamed, true);
    });

    it('should convert Unicode to Zawgyi when toggling', () => {
      const filePath = path.join(TEST_DIR, `${unicodeName}.txt`);
      const renamer = new MyRenamer(filePath);
      const result = renamer.toggle();

      assert.strictEqual(result.renamed, true);
    });
  });

  describe('Folder operations', () => {
    let unicodeFolderName: string;
    let zawgyiFolderName: string;

    before(() => {
      ensureTestDir();
      unicodeFolderName = generateUniqueName(unicodeSample);
      zawgyiFolderName = generateUniqueName(zawgyiSample);
      fs.mkdirSync(path.join(TEST_DIR, unicodeFolderName), { recursive: true });
      fs.mkdirSync(path.join(TEST_DIR, zawgyiFolderName), { recursive: true });
    });

    after(cleanupTestFiles);

    it('should rename Unicode folder to Zawgyi', () => {
      const folderPath = path.join(TEST_DIR, unicodeFolderName);
      const renamer = new MyRenamer(folderPath);
      const result = renamer.toZawgyi();

      assert.strictEqual(result.renamed, true);
    });

    it('should rename Zawgyi folder to Unicode', () => {
      const folderPath = path.join(TEST_DIR, zawgyiFolderName);
      const renamer = new MyRenamer(folderPath);
      const result = renamer.toUnicode();

      assert.strictEqual(result.renamed, true);
    });
  });
});
