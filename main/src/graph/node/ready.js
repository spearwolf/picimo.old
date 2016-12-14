'use strict';

import NodeState from '../node_state';

// ---------------------------------------------------------------------
//
//  A node is *not* ready when ..
//    - `ready = false`
//    - the node state is set to *destroyed* or *error*
//    - a *ready function* is defined by `readyFunc = function () {}`
//      and this functions returns a *falsy* value.
//
// ---------------------------------------------------------------------

export default function defineReady (obj, initialReady) {

    let _ready = !! initialReady;
    let _readyFunc = null;

    Object.defineProperty(obj, 'readyFunc', {
        get: function () {
            return _readyFunc;
        },
        set: function (readyFunc) {
            if (readyFunc === false) {
                _readyFunc = () => false;
            } else if (readyFunc === true) {
                _readyFunc = null;
            } else if (typeof readyFunc === 'function') {
                _readyFunc = readyFunc;
            } else {
                _readyFunc = null;
            }
        }
    });

    Object.defineProperty(obj, 'ready', {
        get: function () {
            return _ready && this.state.isNot(NodeState.ERROR|NodeState.DESTROYED) && (_readyFunc === null || !! _readyFunc());
        },
        set: function (ready) {
            _ready = !! ready;
        }
    });

}

