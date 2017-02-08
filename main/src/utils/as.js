/* jshint esversion:6 */
/* jshint eqnull:true */

export function asNumber (arg, defVal) {
    return Number(isNaN(arg) ? (isNaN(defVal) ? 0 : defVal) : arg);
}

export function asBoolean (arg, defVal) {
    if (typeof arg === 'boolean') {
        return arg;
    } else if (arg === undefined) {
        return !! defVal;
    } else {
        return !! arg;
    }
}

export function asString (arg, defVal) {
    return arg != null ? String(arg) : defVal;
}

