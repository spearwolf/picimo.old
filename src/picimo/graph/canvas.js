'use strict';

import Picture from './picture';
import * as core from '../core';
import { isPowerOfTwo } from '../math';

export default class Canvas extends Picture {

    /*
     * Canvas extra options:
     * ---------------------
     *  - clearColor  : "#00f",
     *  - autoClear   : false,
     *  - canvas      : HTMLCanvasElement           // <= [ optional ]
     *  - canvasSize  : [maze.width, maze.height],  // <= rect or 256 (quad)
     */

    constructor (app, options) {

        const dim = !options.canvas ? extractCanvasSize(options) : {
            width  : options.canvas.width,
            height : options.canvas.height
        };

        if (!isPowerOfTwo(dim.width) || !isPowerOfTwo(dim.height)) {
            throw new Error(`Picimo.graph.Canvas panic: width and height needs to be power of two! but is [${dim.width}, ${dim.height}]`);
        }

        const texture = !options.canvas ? createCanvasTexture(dim) : new core.Texture(options.canvas);
        const opts = Object.assign({}, options, { texture: texture });

        super(app, opts);

        const canvas = texture.image;

        Object.defineProperties(this, {
            canvas: {
                value: canvas,
                enumerable: true,
            },
            ctx: {
                value: canvas.getContext('2d'),
                enumerable: true,
            },
        });

    }

    get glTexture () {
        return this.pipeline && this.pipeline.glTexture;
    }

    update () {
        const tex = this.glTexture;
        if (tex) tex.needsUpload = true;
    }

}

function extractCanvasSize (options) {

    let dim;

    if (typeof options.canvasSize === 'number') {
        dim = {
            width  : options.canvasSize,
            height : options.canvasSize,
        }
    } else if (Array.isArray(options.canvasSize)) {
        dim = {
            width  : options.canvasSize[0],
            height : options.canvasSize[1],
        }
    }

    return dim;

}

function createCanvasTexture (dimension) {

    let canvas = document.createElement('canvas');
    canvas.width = dimension.width;
    canvas.height = dimension.height;

    //let texture = new core.Texture;
    //texture.image = canvas;
    //return texture;

    return core.Texture.fromCanvas(canvas);

}

