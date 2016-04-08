'use strict';

//---------------------------------------------------------
//
// displayPosition: {
//      top     : <number(pixel)> or '50%'
//      left    : <number(pixel)> or '50%'
//      bottom  : <number(pixel)> or '50%'
//      right   : <number(pixel)> or '50%'
//      zoom    : <number> (default is 1.0)
//      width   : <number(pixel)> or '50%'
//      height  : <number(pixel)> or '50%'
//      anchorX : <number(0..1)>
//      anchorY : <number(0..1)>
// }
//
//------------------------------------------------------------

export default class DisplayPosition {

    constructor (picture, opts = {}) {

        this.picture = picture;
        this.picture.verticesNeedsUpdate = true;
        
        this._top     = opts.top;
        this._bottom  = opts.bottom;
        this._left    = opts.left;
        this._right   = opts.right;
        this._width   = opts.width;
        this._height  = opts.height;
        this._zoom    = opts.zoom;
        this._anchorX = opts.anchorX;
        this._anchorY = opts.anchorY;

        Object.seal(this);

    }

    get top ()     { return this._top; }
    get bottom ()  { return this._bottom; }
    get left ()    { return this._left; }
    get right ()   { return this._right; }
    get width ()   { return this._width; }
    get height ()  { return this._height; }
    get zoom ()    { return this._zoom; }
    get anchorX () { return this._anchorX; }
    get anchorY () { return this._anchorY; }

    set top (val)     { if (this._top     !== val) { this._top     = val; this.picture.verticesNeedsUpdate = true; } }
    set bottom (val)  { if (this._bottom  !== val) { this._bottom  = val; this.picture.verticesNeedsUpdate = true; } }
    set left (val)    { if (this._left    !== val) { this._left    = val; this.picture.verticesNeedsUpdate = true; } }
    set right (val)   { if (this._right   !== val) { this._right   = val; this.picture.verticesNeedsUpdate = true; } }
    set width (val)   { if (this._width   !== val) { this._width   = val; this.picture.verticesNeedsUpdate = true; } }
    set height (val)  { if (this._height  !== val) { this._height  = val; this.picture.verticesNeedsUpdate = true; } }
    set zoom (val)    { if (this._zoom    !== val) { this._zoom    = val; this.picture.verticesNeedsUpdate = true; } }
    set anchorX (val) { if (this._anchorX !== val) { this._anchorX = val; this.picture.verticesNeedsUpdate = true; } }
    set anchorY (val) { if (this._anchorY !== val) { this._anchorY = val; this.picture.verticesNeedsUpdate = true; } }

}

