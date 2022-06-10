export default class ServerUtils {
  static isNullOrEmpty(o) {
      if (typeof o === 'string') {
          return o === undefined || o === null || o.length === 0;
      }
      return false;
  }
}
