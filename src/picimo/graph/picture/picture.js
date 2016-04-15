'use strict';

import _ from 'lodash';
import Node from '../node';
import { PicturePipeline } from '../../render/pipeline';
import * as core from '../../core';
import DisplayPosition from './display_position';

export default class Picture extends Node {

    constructor (app, options = {}) {

        super(app, options);

        initTexture(this, options.texture);

        this.program = options.program || 'picimo.sprite'; //'picimo.complexSprite';
        this.sprite = app.spriteFactory.createSprite(options.spriteType || 'simple'); //|| 'default');

        this.sprite.scale = typeof options.scale === 'number' ? options.scale : 1;
        this.sprite.opacity = typeof options.opacity === 'number' ? options.opacity : 1;

        this.posX = options.posX;
        this.posY = options.posY;

        this.pipeline = null;
        this.pipelineSprite = null;
        this.verticesNeedsUpdate = true;

        if (options.displayPosition) {

            this.displayPosition = options.displayPosition;

        } else {  // => sceneFit

            this.sceneFit = options.sceneFit || 'contain';

        }

        this.on('initGl', onInitGl.bind(this, this));
        this.on('renderFrame', onRenderFrame.bind(this, this));
        this.parentNode.on('resize', () => { this.verticesNeedsUpdate = true });

    }

    setVertexPositions ( x0, y0, x1, y1, x2, y2, x3, y3 ) {
        this.sprite.setPos2d(
            x0, y2,
            x1, y3,
            x2, y0,
            x3, y1 );
        return this;
    }

    setPos (x, y) {
        this.posX = x;
        this.posY = y;
        return this;
    }

    get scale () {
        return this.sprite.scale;
    }

    set scale (s) {
        this.sprite.scale = s;
    }

    get opacity () {
        return this.sprite.opacity;
    }

    set opacity (a) {
        return this.sprite.opacity = a;
    }

    get posX () {
        return this._posX;
    }

    set posX (x) {
        this._posX = x;
        this.verticesNeedsUpdate = true;
    }

    get posY () {
        return this._posY;
    }

    set posY (y) {
        this._posY = y;
        this.verticesNeedsUpdate = true;
    }

    get posZ () {
        return this.sprite.posZ;
    }

    set posZ (z) {
        this.sprite.posZ = z;
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

    get sceneFit () {
        return this._sceneFit;
    }

    set sceneFit (ds) {
        this._sceneFit = ds;
        this._displayPosition = null;
        this.verticesNeedsUpdate = true;
    }

    get displayPosition () {
        return this._displayPosition;
    }

    set displayPosition (dp) {
        this._displayPosition = dp != null ? new DisplayPosition(this, dp) : null;
        this._sceneFit = null;
        this.verticesNeedsUpdate = true;
    }

}


function parseLength (val, percentage, imageWidth, imageHeight, sceneWidth, sceneHeight) {

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

function updateTranslate (picture, tx, ty) {

    const scene = picture.parentNode;
    const image = picture.texture;

    picture.sprite.tx = tx + (parseLength(picture.posX, scene.width, image.width, image.height, scene.width, scene.height) || 0);
    picture.sprite.ty = ty + (parseLength(picture.posY, scene.height, image.width, image.height, scene.width, scene.height) || 0);

}

function updateVertices (picture) {

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

        //picture.setVertexPositions(
            //x0, y1,
            //x1, y1,
            //x1, y0,
            //x0, y0 );

        const tx = x0 + ( x1 - x0 ) / 2;
        const ty = y0 + ( y1 - y0 ) / 2;

        x0 -= tx;
        x1 -= tx;
        y0 -= ty;
        y1 -= ty;

        //picture.sprite.tx = tx;
        //picture.sprite.ty = ty;
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
        let pipe = new PicturePipeline(picture.app, pool, texture, program);
        pipelines.push(pipe);

        pipe.onInitGl();
        picture.app.renderer.addPipeline(pipe);

    }

    picture.pipeline = pipelines[0];
    picture.pipelineSprite = picture.pipeline.pool.alloc();  // TODO free()

}

function onRenderFrame ( picture ) {

    updateVertices( picture );
    picture.pipeline.render( picture.sprite );

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

