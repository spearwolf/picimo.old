'use strict';

import _ from 'lodash';
import Node from '../node';
import { PicturePipeline } from '../../render/pipeline';
import * as core from '../../core';
import DisplayPosition from './display_position';
import { asNumber } from '../../utils';
import updateVertices from './update_vertices';

const DEFAULT_WEBGL_PROGRAM = 'picimo.sprite';
const DEFAULT_SPRITE_TYPE   = 'simple';
const DEFAULT_SCENE_FIT     = 'contain';

export default class Picture extends Node {

    constructor (app, options = {}) {

        super(app, options);

        initTexture(this, options.texture);

        this.program = options.program || DEFAULT_WEBGL_PROGRAM;
        this.sprite = app.spriteFactory.createSprite(options.spriteType || DEFAULT_SPRITE_TYPE);

        this.sprite.scale = asNumber(options.scale, 1);
        this.sprite.opacity = asNumber(options.opacity, 1);

        this.posX = options.posX;
        this.posY = options.posY;

        this.pipeline = null;
        this.pipelineSprite = null;
        this.verticesNeedsUpdate = true;

        if (options.displayPosition) {

            this.displayPosition = options.displayPosition;

        } else {  // => sceneFit

            this.sceneFit = options.sceneFit || DEFAULT_SCENE_FIT;

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
        this.sprite.scale = asNumber(s, 1);
    }

    get opacity () {
        return this.sprite.opacity;
    }

    set opacity (a) {
        return this.sprite.opacity = asNumber(a, 1);
    }

    get posX () {
        return this._posX;
    }

    set posX (x) {
        this._posX = asNumber(x, 0);
        this.verticesNeedsUpdate = true;
    }

    get posY () {
        return this._posY;
    }

    set posY (y) {
        this._posY = asNumber(y, 0);
        this.verticesNeedsUpdate = true;
    }

    get posZ () {
        return this.sprite.posZ;
    }

    set posZ (z) {
        this.sprite.posZ = asNumber(z, 0);
    }

    get rotate () {
        return this.sprite.rotate;
    }

    set rotate (radian) {
        this.sprite.rotate = asNumber(radian, 0);
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

    set sceneFit (fit) {
        this._sceneFit = fit;
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

