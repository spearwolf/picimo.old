'use strict';

import eventize from 'eventize-js';
import Picture from './picture';
import * as core from '../core';
import { isPowerOfTwo, findNextPowerOfTwo } from '../math';
import { asBoolean } from '../utils';

export default class Canvas extends Picture {

    //
    // Canvas extra options:
    // ---------------------
    //  - clearColor  : "#00f",                     // [optional]
    //  - autoClear   : false,
    //  - autoUpdate  : false,
    //  - alpha       : true,                       // [optional]
    //  - canvas      : HTMLCanvasElement           // [optional]
    //  - canvasSize  : number                      // [optional]
    //                | [width, height]
    //                | {x, y, width, height}
    //

    constructor (app, options) {

        const dimension = extractCanvasSize(options);

        let canvas;
        if (options.canvas) {  // <= predefined canvas
            canvas = options.canvas;
            if (!isPowerOfTwo(canvas.width) || !isPowerOfTwo(canvas.height)) {
                throw new Error(`Picimo.graph.Canvas panic: width and height of predefined canvas needs to be power of two! but is [${canvas.width}, ${canvas.height}]`);
            }
        } else {
            canvas = createCanvas(dimension);
        }

        const texture = createTexture(canvas, dimension);
        const opts = Object.assign({}, options, { texture: texture });

        super(app, opts);

        setCanvas(this, texture.image, asBoolean(options.alpha, true));

        this.dimension = dimension;
        this.clearColor = options.clearColor;
        this.autoClear = options.autoClear;
        this.autoUpdate = options.autoUpdate;

    }

    set autoClear (autoClear) {
        this._autoClear = asBoolean(autoClear, false);
        if (this._autoClear) {
            if (!this._clearCanvas) {
                this._clearCanvas = this.on('renderFrame', eventize.PRIO_MAX, clearCanvas.bind(this, this));
            }
        } else if (this._clearCanvas) {
            this.off(this._clearCanvas);
            this._clearCanvas = 0;
        }
    }

    get autoClear () {
        return this._autoClear;
    }

    set autoUpdate (autoUpdate) {
        this._autoUpdate = asBoolean(autoUpdate, false);
        if (this._autoUpdate) {
            if (!this._updateTexture) {
                this._updateTexture = this.on('renderFrame', this.update.bind(this));
            }
        } else if (this._updateTexture) {
            this.off(this._updateTexture);
            this._updateTexture = 0;
        }
    }

    get autoUpdate () {
        return this._autoUpdate;
    }

    get webGlTexture () {
        return this.pipeline && this.pipeline.webGlTexture;
    }

    update () {
        const tex = this.webGlTexture;
        if (tex) tex.needsUpload = true;
    }

}

function clearCanvas (canvas) {
    const dim = canvas.dimension;
    const ctx = canvas.ctx;
    if (canvas.clearColor) {
        ctx.fillStyle = canvas.clearColor;
        ctx.fillRect(dim.x, dim.y, dim.width, dim.height);
    } else {
        ctx.clearRect(dim.x, dim.y, dim.width, dim.height);
    }
}

function setCanvas (obj, canvas, alpha) {

    Object.defineProperties(obj, {
        canvas: {
            value: canvas,
            enumerable: true,
        },
        ctx: {
            value: canvas.getContext('2d', { alpha }),
            enumerable: true,
        },
    });

}

function extractCanvasSize (options) {

    if (typeof options.canvasSize === 'number') {
        return new core.Viewport(0, 0, parseInt(options.canvasSize, 10), parseInt(options.canvasSize, 10));
    } else if (Array.isArray(options.canvasSize)) {
        return new core.Viewport(0, 0, parseInt(options.canvasSize[0], 10), parseInt(options.canvasSize[1], 10));
    } else if (typeof options.canvasSize === 'object') {
        return new core.Viewport(
            parseInt(options.canvasSize.x, 10),
            parseInt(options.canvasSize.y, 10),
            parseInt(options.canvasSize.width, 10),
            parseInt(options.canvasSize.height, 10));
    } else if (options.canvas) {
        return new core.Viewport(0, 0, options.canvas.width, options.canvas.height);
    } else {
        throw new Error(`Picimo.graph.Canvas panic! couldn't determinate canvas size!`);
    }

}

function createCanvas (dimension) {

    const canvas = document.createElement('canvas');

    canvas.width = findNextPowerOfTwo(dimension.x + dimension.width);
    canvas.height = findNextPowerOfTwo(dimension.y + dimension.height);

    return canvas;

}

function createTexture (canvas, dimension) {

    let texture = core.Texture.fromCanvas(canvas);

    if (dimension.x || dimension.y || dimension.width !== texture.width || dimension.height !== texture.height) {
        texture = new core.Texture(texture, dimension.x, dimension.y, dimension.width, dimension.height);
    }

    return texture;

}

