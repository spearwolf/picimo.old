import { asNumber } from '../../utils';

const DEFAULT_RENDER_PRIO = 0;

export default function defineRenderPrio (obj, initialRenderPrio) {

    var _renderPrio = asNumber(initialRenderPrio, DEFAULT_RENDER_PRIO);

    Object.defineProperty(obj, 'renderPrio', {
        get: function () {
            return _renderPrio;
        },
        set: function (renderPrio) {
            let prio = asNumber(renderPrio, DEFAULT_RENDER_PRIO);
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

