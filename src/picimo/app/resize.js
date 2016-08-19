'use strict';

/**
 * @private
 */
export default function () {

    var node, w, h, wPx, hPx;

    if ( this.canvasIsPredefined ) {

        node = this.canvas;

        w = Math.round( this.canvas.clientWidth * this.devicePixelRatio );
        h = Math.round( this.canvas.clientHeight * this.devicePixelRatio );

    } else {

        node = this.canvas.parentNode.parentNode;

        wPx = node.clientWidth;
        hPx = node.clientHeight;

        w = Math.round( wPx * this.devicePixelRatio );
        h = Math.round( hPx * this.devicePixelRatio );

        this.canvas.style.width  = `${wPx}px`;
        this.canvas.style.height = `${hPx}px`;

    }

    if ( this.canvas.width !== w || this.canvas.height !== h ) {

        this.canvas.width  = w;
        this.canvas.height = h;

    }

    if ( this.width !== w || this.height !== h ) {

        //--------------------------------------------------
        // this is the real/physical/device pixel dimension
        //-------------------------------------------------

        this.width = w;
        this.height = h;

        if ( this.renderer ) {

            this.renderer.onResize();

        }

        this.emit('resize');

    }

}

