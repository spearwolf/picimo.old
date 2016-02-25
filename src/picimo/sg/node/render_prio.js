'use strict';

import * as utils from '../../utils';

const DEFAULT_RENDER_PRIO = 0;

export default function (obj, initialRenderPrio) {

    var _renderPrio = utils.asNumber(initialRenderPrio, DEFAULT_RENDER_PRIO);

    Object.defineProperty(obj, 'renderPrio', {
        get: function () {
            return _renderPrio;
        },
        set: function (renderPrio) {
            let prio = utils.asNumber(renderPrio, DEFAULT_RENDER_PRIO);
            if (prio !== _renderPrio) {
                _renderPrio = prio;
                if (this.parentNode) {
                    this.parentNode.emit("childrenUpdated");
                }
            }
        },
        enumerable: true
    });

}

