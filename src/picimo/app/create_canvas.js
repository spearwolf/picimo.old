'use strict';

import * as utils from '../utils';

/**
 * @private
 */
export default function ( app, canvas, appendTo ) {

    utils.object.definePropertyPublicRO( app, 'canvasIsPredefined', canvas !== undefined );

    canvas = app.canvasIsPredefined ? canvas : document.createElement( 'canvas' );
    utils.object.definePropertyPublicRO( app, 'canvas', canvas );

    if ( ! app.canvasIsPredefined ) {

        canvas.style.boxSizing   = 'border-box;'
        canvas.style.margin      = '0';
        canvas.style.padding     = '0';
        canvas.style.border      = '0';
        canvas.style.position    = 'absolute';
        canvas.style.top         = '0';
        canvas.style.left        = '0';
        canvas.style.bottom      = '0';
        canvas.style.right       = '0';
        canvas.style.touchAction = 'none';
        setUserSelectStyle(canvas);

        let parentNode;
        let containerNode;

        containerNode = document.createElement('div');

        containerNode.style.position    = 'relative';
        containerNode.style.boxSizing   = 'border-box;'
        containerNode.style.margin      = '0';
        containerNode.style.padding     = '0';
        containerNode.style.border      = '0';
        containerNode.style.overflow    = 'hidden';
        containerNode.style.width       = '100%';
        containerNode.style.height      = '100%';
        containerNode.style.touchAction = 'none';
        setUserSelectStyle(containerNode);

        containerNode.appendChild( canvas );

        parentNode = appendTo || document.body;
        parentNode.appendChild( containerNode );

    }

}

function setUserSelectStyle (element, value = 'none') {

    if ('webkitUserSelect' in element.style) element.style.webkitUserSelect = value;
    if ('mozUserSelect' in element.style) element.style.mozUserSelect = value;
    if ('msUserSelect' in element.style) element.style.msUserSelect = value;
    if ('userSelect' in element.style) element.style.userSelect = value;

}

