declare module 'myanmar-tools' {
  class ZawgyiDetector {
    constructor();
    getZawgyiProbability(input: string): number;
  }

  class ZawgyiConverter {
    constructor();
    zawgyiToUnicode(inString: string): string;
    unicodeToZawgyi(inString: string): string;
    normalizeZawgyi(inString: string): string;
  }
}
