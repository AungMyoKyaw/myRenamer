declare module 'myanmar-tools' {
  /**
   * Detector for determining if text is Zawgyi or Unicode encoded.
   * Uses a machine learning model to calculate probability scores.
   */
  class ZawgyiDetector {
    constructor();
    /**
     * Gets the probability that the input string is Zawgyi encoded.
     * @param input - The string to analyze
     * @returns Probability score (0 = definitely Unicode, 1 = definitely Zawgyi)
     */
    getZawgyiProbability(input: string): number;
  }

  /**
   * Converter for transforming text between Zawgyi and Unicode encodings.
   */
  class ZawgyiConverter {
    constructor();
    /**
     * Converts Zawgyi encoded text to Unicode.
     * @param inString - The Zawgyi encoded string
     * @returns The Unicode encoded string
     */
    zawgyiToUnicode(inString: string): string;
    /**
     * Converts Unicode encoded text to Zawgyi.
     * @param inString - The Unicode encoded string
     * @returns The Zawgyi encoded string
     */
    unicodeToZawgyi(inString: string): string;
    /**
     * Normalizes Zawgyi text to a standard form.
     * @param inString - The Zawgyi string to normalize
     * @returns The normalized Zawgyi string
     */
    normalizeZawgyi(inString: string): string;
  }

  interface MyanmarTools {
    ZawgyiDetector: typeof ZawgyiDetector;
    ZawgyiConverter: typeof ZawgyiConverter;
  }

  const myanmarTools: MyanmarTools;
  export = myanmarTools;
}
