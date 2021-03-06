export function log2(fmt, ...args) {
    let _fmt = "[INFO - " + new Date().toLocaleString('en-US') + "] " + fmt;
    if (!(args.length)) {
        console.log(_fmt);
    } else {
        console.log(_fmt, ...args);
    }
}

export function log2_e(fmt, ...args) {
    let _fmt = "[ERROR - " + new Date().toLocaleString('en-US') + "] " + fmt;
    if (!(args.length)) {
        console.log(_fmt);
    } else {
        console.log(_fmt, ...args);
    }
}