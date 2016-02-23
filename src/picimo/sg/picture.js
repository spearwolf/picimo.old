'use strict';

import _ from 'lodash';
import Node from './node';
import { PicturePipeline } from '../webgl/pipeline';
import * as core from '../core';

/**
 * @class Picimo.sg.Picture
 * @extends Picimo.sg.Node
 *
 * @param {Picimo.App} app - The app instance
 * @param {object} [options] - The options
 * @param {Picimo.core.Texture|Promise} [options.texture] -
 * @param {string} [options.program="picture"] - The webgl program name
 *
 * @summary
 * Represents a single picture.
 *
 * @classdesc
 * A Picture renders an single image to the screen.
 *
 * displaySize: 'contain' or 'cover'
 *
 * or
 *
 * displayPosition: {
 *      top: <number(pixel)> or '50%'
 *      left: <number(pixel)> or '50%'
 *      bottom: <number(pixel)> or '50%'
 *      right: <number(pixel)> or '50%'
 *      zoom: <number> (default is 1.0)
 *      width: <number(pixel)> or '50%'
 *      height: <number(pixel)> or '50%'
 *      anchorX: <number(0..1)>
 *      anchorY: <number(0..1)>
 * }
 *
 * displayPosition has precedence over displaySize
 *
 * TODO
 *  - create DisplayPosition helper class ?
 *
 */

export default class Picture extends Node {

    constructor (app, options = {}) {
        super(app, options);

        initTexture(this, options.texture);

        this.program = options.program || "picture";

        this.sprite = app.sprites.createSprite();

        let zoom = typeof options.zoom === 'number' ? options.zoom : 1;
        this.sprite.sx = zoom;
        this.sprite.sy = zoom;
        this.sprite.opacity = typeof options.opacity === 'number' ? options.opacity : 1;

        if (typeof options.posX === 'number') this.posX = options.posX;
        if (typeof options.posY === 'number') this.posY = options.posY;

        this.pipeline = null;
        this.pipelineSprite = null;

        this.verticesNeedsUpdate = true;

        if (options.displayPosition) {

            this.displayPosition = options.displayPosition;
            this.displaySize = null;

        } else {  // => displaySize

            this.displaySize = options.displaySize || "contain";
            this.displayPosition = null;

        }

        this.on("initGl", onInitGl.bind(this, this));
        this.on("renderFrame", onRenderFrame.bind(this, this));
        this.parentNode.on('resize', () => { this.verticesNeedsUpdate = true });

    }

    setVertexPositions ( x0, y0, x1, y1, x2, y2, x3, y3 ) {
        this.sprite.setSize(1, 1);
        this.sprite.setXwyh(
            x0, y2,
            x1, y3,
            x2, y0,
            x3, y1 );
    }

    setPos (x, y) {
        this.sprite.setPos(x, y);
        return this;
    }

    translate (tx, ty) {
        let sprite = this.sprite;
        sprite.setPos(sprite.x + tx, sprite.y + ty);
        return this;
    }

    setScale (sx, sy) {
        this.sprite.setScale(sx, sy);
        return this;
    }

    setZoom (s) {
        this.sprite.setScale(s, s);
        return this;
    }

    setRgb (r, g, b) {
        this.sprite.setRgb(r, g, b);
        return this;
    }

    setRgba (r, g, b, a) {
        this.sprite.setColor(r, g, b, a);
        return this;
    }

    get scaleX () {
        return this.sprite.sx;
    }

    set scaleX (sx) {
        this.sprite.sx = sx;
    }

    get scaleY () {
        return this.sprite.sy;
    }

    set scaleY (sy) {
        this.sprite.sy = sy;
    }

    get opacity () {
        return this.sprite.opacity;
    }

    set opacity (a) {
        return this.sprite.opacity = a;
    }

    get posX () {
        return this.sprite.x;
    }

    set posX (x) {
        this.sprite.x = x;
    }

    get posY () {
        return this.sprite.y;
    }

    set posY (y) {
        this.sprite.y = y;
    }

    get rotate () {
        return this.sprite.rotate;
    }

    set rotate (radian) {
        this.sprite.rotate = radian;
    }

    get rotateDegree () {
        return this.sprite.rotate * 180.0 / Math.PI;
    }

    set rotateDegree (degree) {
        this.sprite.rotate = degree * (Math.PI / 180.0);
    }

}


function updateVertices (picture) {

    if (!picture.verticesNeedsUpdate) return;
    else picture.verticesNeedsUpdate = false;

    // vertex positions
    // ========================================

    let halfWidth;
    let halfHeight;

    let dp = picture.displayPosition;

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

        let sceneWidth = picture.parentNode.width;
        let sceneHeight = picture.parentNode.height;

        let dpLeft   = typeof dp.left === 'string'   ? sceneWidth  * (parseFloat(dp.left) / 100.0)   : dp.left;
        let dpRight  = typeof dp.right === 'string'  ? sceneWidth  * (parseFloat(dp.right) / 100.0)  : dp.right;
        let dpTop    = typeof dp.top === 'string'    ? sceneHeight * (parseFloat(dp.top) / 100.0)    : dp.top;
        let dpBottom = typeof dp.bottom === 'string' ? sceneHeight * (parseFloat(dp.bottom) / 100.0) : dp.bottom;

        let x0 = typeof dpLeft === 'number'   ? dpLeft                 : null;
        let x1 = typeof dpRight === 'number'  ? sceneWidth - dpRight   : null;
        let y0 = typeof dpTop === 'number'    ? dpTop                  : null;
        let y1 = typeof dpBottom === 'number' ? sceneHeight - dpBottom : null;

        // #=======# //
        // # width # //
        // #=======# //

        let w;

        if (typeof x0 === 'number' && typeof x1 === 'number') {

            // left & right
            w = x1 - x0;

        } else if (typeof dp.zoom === 'number') {

            // zoom
            w = picture.texture.width * dp.zoom;

        } else if (typeof dp.width === 'number') {

            // width
            w = dp.width;

        } else if (typeof dp.width === 'string') {

            // width
            w = picture.texture.width * parseFloat(dp.width) / 100.0;

        }

        // #========# //
        // # height # //
        // #========# //

        let h;

        if (typeof y0 === 'number' && typeof y1 === 'number') {

            // left and right
            h = y1 - y0;

        } else if (typeof dp.zoom === 'number') {

            // zoom
            h = picture.texture.height * dp.zoom;

        } else if (typeof dp.height === 'number') {

            // height
            h = dp.height;

        } else if (typeof dp.height === 'string') {

            // height
            h = picture.texture.height * parseFloat(dp.height) / 100.0;

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

        let anchorX = dp.anchorX || 0.0;
        let anchorY = dp.anchorY || 0.0;

        let ax = anchorX * (x1 - x0);
        let ay = anchorY * (y1 - y0);

        x0 -= halfWidth - ax;
        x1 -= halfWidth - ax;
        y0 = sceneHeight - y0 - halfHeight + ay;
        y1 = sceneHeight - y1 - halfHeight + ay;

        picture.setVertexPositions(
            x0, y1,
            x1, y1,
            x1, y0,
            x0, y0 );

    } else {

        // displaySize 'contain' or 'cover'
        // ----------------------------------------

        let viewWidth  = picture.parentNode.width;
        let viewHeight = picture.parentNode.height;
        let viewRatio  = viewHeight / viewWidth;
        let texRatio   = picture.texture.height / picture.texture.width;

        if (texRatio === 1) {

            if ('cover' === picture.displaySize) {
                halfHeight = halfWidth = 0.5 * (viewRatio > 1 ? viewHeight : viewWidth);
            } else { // 'contain'
                halfHeight = halfWidth = 0.5 * (viewRatio < 1 ? viewHeight : viewWidth);
            }

        } else {

            let scale;

            if ('cover' === picture.displaySize) {
                scale = texRatio > viewRatio ? viewWidth / picture.texture.width : viewHeight / picture.texture.height;
            } else { // "contain"
                scale = texRatio < viewRatio ? viewWidth / picture.texture.width : viewHeight / picture.texture.height;
            }

            halfWidth  = 0.5 * scale * picture.texture.width
            halfHeight = 0.5 * scale * picture.texture.height

        }

        picture.setVertexPositions(
            -halfWidth, -halfHeight,
             halfWidth, -halfHeight,
             halfWidth,  halfHeight,
            -halfWidth,  halfHeight );

    }

}

function onInitGl (picture) {

    if (!picture.pipeline) initPipeline(picture);

}

function initPipeline (picture) {

    // find available picture pipelines
    let pipelines = picture.app.renderer.filterPipelineByInstanceof(PicturePipeline);
    let descriptor = picture.sprite.descriptor;
    let texture = picture.texture;
    let program = picture.program;

    pipelines = _.filter(pipelines, pipe => pipe.texture === texture);
    pipelines = _.filter(pipelines, pipe => pipe.program === program);
    pipelines = _.filter(pipelines, pipe => pipe.pool.descriptor === descriptor);
    pipelines = _.filter(pipelines, pipe => pipe.pool.availableCount);

    if (!pipelines.length) {

        let pool = new core.VertexObjectPool(descriptor, PicturePipeline.DEFAULT_CAPACITY);
        pipelines[0] = new PicturePipeline(picture.app, pool, texture, program);

        pipelines[0].onInitGl();
        picture.app.renderer.addPipeline(pipelines[0]);

    }

    picture.pipeline = pipelines[0];
    picture.pipelineSprite = picture.pipeline.pool.alloc();  // TODO free()

}

function onRenderFrame ( picture ) {

    updateVertices(picture);
    picture.pipeline.render(picture.sprite);  // TODO display?

}

function initTexture ( picture, texture ) {

    picture.texture = null;
    picture.readyFunc = false;

    Promise.resolve(texture.promise||texture)
        .then(function (tex) {
            picture.texture = tex;
            picture.texture.setTexCoords(picture.sprite);
            return tex.image.promise;
        })
        .then(() => { picture.readyFunc = true });

}

