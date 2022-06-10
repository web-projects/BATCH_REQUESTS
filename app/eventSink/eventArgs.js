export default class EventArgs {
    constructor(code, obj) {
        this.eventCode = code;
        this.eventObject = obj || null;
    }
}
