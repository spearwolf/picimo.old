'use strict';

/**
 * @private
 */
export default function (val, percentage, imageWidth, imageHeight, sceneWidth, sceneHeight) {

    if (typeof val === 'string') {

        const str = val.trim();

        if (str.endsWith('px')) { return parseFloat(str); }
        else if (percentage  !== undefined && str.endsWith('%'))  { return percentage  * parseFloat(str) / 100.0; }
        else if (imageWidth  !== undefined && str.endsWith('iw')) { return imageWidth  * parseFloat(str) / 100.0; }
        else if (imageHeight !== undefined && str.endsWith('ih')) { return imageHeight * parseFloat(str) / 100.0; }
        else if (sceneWidth  !== undefined && str.endsWith('sw')) { return sceneWidth  * parseFloat(str) / 100.0; }
        else if (sceneHeight !== undefined && str.endsWith('sh')) { return sceneHeight * parseFloat(str) / 100.0; }

    } else if (typeof val === 'number') {
        return val;
    }

    return val != null ? parseFloat(val) : null;  // fallback

}

