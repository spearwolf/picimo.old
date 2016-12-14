'use strict';

import parseLength from './parse_length';

function updateTranslate (picture, tx, ty) {

    const scene = picture.parentNode;
    const image = picture.texture;

    picture.sprite.tx = tx + (parseLength(picture.posX, scene.width, image.width, image.height, scene.width, scene.height) || 0);
    picture.sprite.ty = ty + (parseLength(picture.posY, scene.height, image.width, image.height, scene.width, scene.height) || 0);

}

/**
 * @private
 */
export default function (picture) {

    if (!picture.verticesNeedsUpdate) return;
    picture.verticesNeedsUpdate = false;

    // vertex positions
    // ========================================

    let halfWidth;
    let halfHeight;

    const dp = picture.displayPosition;

    if (dp) {

        // displayPosition
        // ----------------------------------------
        //
        // - top
        // - left
        // - right
        // - bottom
        // - zoom
        // - width
        // - height
        // - anchorX
        // - anchorY

        const sceneWidth = picture.parentNode.width;
        const sceneHeight = picture.parentNode.height;

        const pictureWidth = picture.texture.width;
        const pictureHeight = picture.texture.height;

        const dpLeft   = parseLength(dp.left,   sceneWidth,  pictureWidth, pictureHeight, sceneWidth, sceneHeight);
        const dpRight  = parseLength(dp.right,  sceneWidth,  pictureWidth, pictureHeight, sceneWidth, sceneHeight);
        const dpTop    = parseLength(dp.top,    sceneHeight, pictureWidth, pictureHeight, sceneWidth, sceneHeight);
        const dpBottom = parseLength(dp.bottom, sceneHeight, pictureWidth, pictureHeight, sceneWidth, sceneHeight);

        let x0 = typeof dpLeft   === 'number' ? dpLeft                 : null;
        let x1 = typeof dpRight  === 'number' ? sceneWidth - dpRight   : null;
        let y0 = typeof dpTop    === 'number' ? dpTop                  : null;
        let y1 = typeof dpBottom === 'number' ? sceneHeight - dpBottom : null;

        // #=======# //
        // # width # //
        // #=======# //

        let w;

        if (typeof x0 === 'number' && typeof x1 === 'number') {

            // left & right
            w = x1 - x0;

        } else {

            // dp.width
            w = parseLength(dp.width, pictureWidth, pictureWidth, pictureHeight, sceneWidth, sceneHeight);

        }

        if (typeof dp.zoom === 'number') {

            // zoom
            w = ( w === null ? picture.texture.width : w ) * dp.zoom;

        }

        // #========# //
        // # height # //
        // #========# //

        let h;

        if (typeof y0 === 'number' && typeof y1 === 'number') {

            // left and right
            h = y1 - y0;

        } else {

            // dp.height
            h = parseLength(dp.height, pictureHeight, pictureWidth, pictureHeight, sceneWidth, sceneHeight);

        }

        if (typeof dp.zoom === 'number') {

            // zoom
            h = ( h === null ? picture.texture.height : h ) * dp.zoom;

        }

        // #===# //
        // # x # //
        // #===# //

        if (x0 === null && typeof x1 === 'number') {

            // right
            x0 = x1 - w;

        } else if (x1 === null && typeof x0 === 'number') {

            // left
            x1 = x0 + w;

        }

        // #===# //
        // # y # //
        // #===# //

        if (y0 === null && typeof y1 === 'number') {

            // bottom
            y0 = y1 - h;

        } else if (y1 === null && typeof y0 === 'number') {

            // top
            y1 = y0 + h;

        }

        halfWidth  = 0.5 * sceneWidth;
        halfHeight = 0.5 * sceneHeight;

        const anchorX = dp.anchorX || 0.0;
        const anchorY = dp.anchorY || 0.0;

        const ax = anchorX * (x1 - x0);
        const ay = anchorY * (y1 - y0);

        x0 -= halfWidth - ax;
        x1 -= halfWidth - ax;

        y0 = sceneHeight - y0 - halfHeight + ay;
        y1 = sceneHeight - y1 - halfHeight + ay;

        const tx = x0 + ( x1 - x0 ) / 2;
        const ty = y0 + ( y1 - y0 ) / 2;

        x0 -= tx;
        x1 -= tx;
        y0 -= ty;
        y1 -= ty;

        updateTranslate(picture, tx, ty);

        picture.setVertexPositions(
            x0, y1,
            x1, y1,
            x1, y0,
            x0, y0 );

    } else {

        // sceneFit 'contain' or 'cover'
        // ----------------------------------------

        const viewWidth  = picture.parentNode.width;
        const viewHeight = picture.parentNode.height;
        const viewRatio  = viewHeight / viewWidth;
        const texRatio   = picture.texture.height / picture.texture.width;

        if (texRatio === 1) {

            if ('cover' === picture.sceneFit) {
                halfHeight = halfWidth = 0.5 * (viewRatio > 1 ? viewHeight : viewWidth);
            } else { // 'contain'
                halfHeight = halfWidth = 0.5 * (viewRatio < 1 ? viewHeight : viewWidth);
            }

        } else {

            let scale;

            if ('cover' === picture.sceneFit) {
                scale = texRatio > viewRatio ? viewWidth / picture.texture.width : viewHeight / picture.texture.height;
            } else { // "contain"
                scale = texRatio < viewRatio ? viewWidth / picture.texture.width : viewHeight / picture.texture.height;
            }

            halfWidth  = 0.5 * scale * picture.texture.width
            halfHeight = 0.5 * scale * picture.texture.height

        }

        updateTranslate(picture, 0, 0);

        picture.setVertexPositions(
            -halfWidth, -halfHeight,
             halfWidth, -halfHeight,
             halfWidth,  halfHeight,
            -halfWidth,  halfHeight );

    }

}


