import fs from 'fs';
import path from 'path';

import myanmarTools from 'myanmar-tools';

const detector = new myanmarTools.ZawgyiDetector();
const converter = new myanmarTools.ZawgyiConverter();

/** Default threshold for Zawgyi detection (probability > 0.5 = Zawgyi) */
const DEFAULT_DECISION_BOUNDARY = 0.5;

/** Options for rename operations */
export interface RenameOption {
  /**
   * If true, only rename if the file is detected as the source encoding.
   * - For toZawgyi: only converts if currently Unicode
   * - For toUnicode: only converts if currently Zawgyi
   */
  check?: boolean;
}

/** Result of a rename operation */
export interface RenameResult {
  /** Whether the rename was performed */
  renamed: boolean;
  /** Original path */
  originalPath: string;
  /** New path (undefined if not renamed) */
  newPath?: string;
  /** Reason for skipping (if applicable) */
  reason?: string;
}

/**
 * A utility class for renaming files and folders between Zawgyi and Unicode encodings.
 *
 * @example
 * ```typescript
 * const renamer = new MyRenamer('/path/to/file');
 * renamer.toUnicode();
 * ```
 */
class MyRenamer {
  private readonly filePath: string;
  private readonly baseName: string;
  private readonly decisionBoundary: number;

  /**
   * Creates a new MyRenamer instance.
   *
   * @param filePath - Absolute or relative path to the file or folder
   * @param decisionBoundary - Threshold for Zawgyi detection (default: 0.5)
   * @throws Error if filePath is empty
   */
  constructor(filePath: string, decisionBoundary: number = DEFAULT_DECISION_BOUNDARY) {
    if (!filePath || filePath.trim() === '') {
      throw new Error('File path cannot be empty');
    }
    this.filePath = filePath;
    this.baseName = path.basename(this.filePath);
    this.decisionBoundary = decisionBoundary;
  }

  /**
   * Gets the Zawgyi probability score for the given input string.
   *
   * @param input - The string to analyze
   * @returns Probability score (0 = definitely Unicode, 1 = definitely Zawgyi)
   */
  private getZawgyiProbability(input: string): number {
    return detector.getZawgyiProbability(input);
  }

  /**
   * Generates the new path with the name converted to Zawgyi encoding.
   *
   * @param filePath - Original file path
   * @returns New path with Zawgyi-encoded name
   */
  private newZawgyiPath(filePath: string): string {
    const parsedPath = path.parse(filePath);
    parsedPath.name = converter.unicodeToZawgyi(parsedPath.name);
    // Clear base to force path.format to use name + ext
    parsedPath.base = '';
    return path.format(parsedPath);
  }

  /**
   * Generates the new path with the name converted to Unicode encoding.
   *
   * @param filePath - Original file path
   * @returns New path with Unicode-encoded name
   */
  private newUnicodePath(filePath: string): string {
    const parsedPath = path.parse(filePath);
    parsedPath.name = converter.zawgyiToUnicode(parsedPath.name);
    // Clear base to force path.format to use name + ext
    parsedPath.base = '';
    return path.format(parsedPath);
  }

  /**
   * Gets the Zawgyi probability score for the current file/folder name.
   *
   * @returns Probability score (0-1)
   * - Values closer to 1 indicate Zawgyi encoding
   * - Values closer to 0 indicate Unicode encoding
   *
   * @example
   * ```typescript
   * const renamer = new MyRenamer('/path/to/file');
   * const probability = renamer.isZawgyi;
   * console.log(probability); // 0.95 (likely Zawgyi)
   * ```
   */
  get isZawgyi(): number {
    return this.getZawgyiProbability(this.baseName);
  }

  /**
   * Gets the original file path.
   *
   * @returns The original file path
   */
  get originalPath(): string {
    return this.filePath;
  }

  /**
   * Gets the base name of the file/folder.
   *
   * @returns The base name (filename with extension)
   */
  get name(): string {
    return this.baseName;
  }

  /**
   * Renames the file/folder to Zawgyi encoding.
   *
   * @param option - Rename options
   * @returns Result of the rename operation
   *
   * @example
   * ```typescript
   * const renamer = new MyRenamer('/path/to/file');
   * // Force conversion
   * renamer.toZawgyi();
   * // Only convert if currently Unicode
   * renamer.toZawgyi({ check: true });
   * ```
   */
  toZawgyi(option: RenameOption = { check: false }): RenameResult {
    const baseResult: RenameResult = {
      renamed: false,
      originalPath: this.filePath,
    };

    if (option.check) {
      const score = this.getZawgyiProbability(this.baseName);
      if (score >= this.decisionBoundary) {
        return {
          ...baseResult,
          reason: 'SKIP RENAMING TO ZAWGYI - already Zawgyi',
        };
      }
    }

    const newPath = this.newZawgyiPath(this.filePath);

    if (newPath === this.filePath) {
      return {
        ...baseResult,
        reason: 'SKIP RENAMING TO ZAWGYI - conversion produced same path',
      };
    }

    fs.renameSync(this.filePath, newPath);

    return {
      renamed: true,
      originalPath: this.filePath,
      newPath,
    };
  }

  /**
   * Renames the file/folder to Unicode encoding.
   *
   * @param option - Rename options
   * @returns Result of the rename operation
   *
   * @example
   * ```typescript
   * const renamer = new MyRenamer('/path/to/file');
   * // Force conversion
   * renamer.toUnicode();
   * // Only convert if currently Zawgyi
   * renamer.toUnicode({ check: true });
   * ```
   */
  toUnicode(option: RenameOption = { check: false }): RenameResult {
    const baseResult: RenameResult = {
      renamed: false,
      originalPath: this.filePath,
    };

    if (option.check) {
      const score = this.getZawgyiProbability(this.baseName);
      if (score < this.decisionBoundary) {
        return {
          ...baseResult,
          reason: 'SKIP RENAMING TO UNICODE - already Unicode',
        };
      }
    }

    const newPath = this.newUnicodePath(this.filePath);

    if (newPath === this.filePath) {
      return {
        ...baseResult,
        reason: 'SKIP RENAMING TO UNICODE - conversion produced same path',
      };
    }

    fs.renameSync(this.filePath, newPath);

    return {
      renamed: true,
      originalPath: this.filePath,
      newPath,
    };
  }

  /**
   * Toggles between Zawgyi and Unicode encodings based on detected encoding.
   * - Zawgyi names are converted to Unicode
   * - Unicode names are converted to Zawgyi
   *
   * @returns Result of the rename operation
   *
   * @example
   * ```typescript
   * const renamer = new MyRenamer('/path/to/file');
   * renamer.toggle();
   * ```
   */
  toggle(): RenameResult {
    const score = this.getZawgyiProbability(this.baseName);
    if (score > this.decisionBoundary) {
      return this.toUnicode();
    }
    return this.toZawgyi();
  }
}

export default MyRenamer;

// CommonJS compatibility
module.exports = MyRenamer;
module.exports.default = MyRenamer;
