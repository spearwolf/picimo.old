import glMatrix from 'gl-matrix';
import Color from 'color-js';
export { glMatrix, Color };

import * as object_utils from './object_utils';
export { object_utils as object };

import makeReadyPromise from './make_ready_promise';
import addGlxProperty from './add_glx_property';
import addUid from './add_uid';
export { makeReadyPromise, addGlxProperty, addUid };

import delegateMethods from './delegate_methods';
export { delegateMethods };


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

