export default class URLHelper {
  static getHostName() {
    return window.location.hostname;
  }

  static visitInCurrentWindow(url) {
    window.location.href = url;
  }

  static visitInNewWindow(url) {
    window.open(url);
  }
}
