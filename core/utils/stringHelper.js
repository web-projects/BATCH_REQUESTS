export default class StringHelper {
    static toProperCase = (sentence) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      sentence.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

    static isLineBreak = (char) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      char === '\n' || char === '\r' || char === '\r\n';

    static normalizeLineEndings = (str) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      str.replace(/(\r|\n)/g, ' ');

    static looseStringCompare(a, b) {
      const normalizedStrA = this.normalizeLineEndings(a);
      const normalizedStrB = this.normalizeLineEndings(b);

      const maxComparisonLength = Math.min(a.length, b.length);

      let i = 0;
      let j = 0;
      let charsSeen = 0;

      while (charsSeen < maxComparisonLength && (i < normalizedStrA.length || j < normalizedStrB.length)) {
        while (i < normalizedStrA.length && normalizedStrA.charAt(i) === ' ') {
          ++i;
        }

        while (j < normalizedStrB.length && normalizedStrB.charAt(j) === ' ') {
          ++j;
        }

        if (normalizedStrA.charAt(i++) !== normalizedStrB.charAt(j++)) {
          return false;
        }

        charsSeen++;
      }

      return true;
    }
}
