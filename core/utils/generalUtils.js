export default class GeneralUtils {
    static getScreenSize() {
        return {
            width: $(window).width(),
            height: $(window).height(),
        };
    }

    static isNull(o) {
        return o === null || o === undefined;
    }
}
