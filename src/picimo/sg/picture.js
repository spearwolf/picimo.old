'use strict';

import _ from 'lodash';
import Node from './node';
import { PicturePipeline } from '../webgl/pipeline';
import core from '../core';

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
 * All vertex data will be will be uploaded to the GPU *every frame*.
 *
 */

export default class Picture extends Node {

    constructor (app, options = {}) {

        super(app, options);

        initTexture(this, options.texture);

        this.program = options.program || "picture";

        this.sprite = app.sprites.createSprite();
        this.sprite.sx = 1;
        this.sprite.sy = 1;
        this.sprite.opacity = 1;

        this.pipeline = null;
        this.pipelineSprite = null;

        this.on("initGl", onInitGl.bind(this, this));
        this.on("renderFrame", -1000, onRenderFrame.bind(this, this));

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

    picture.pipeline.render(this.sprite);  // TODO display?

}

function initTexture ( picture, texture ) {

    picture.texture = null;
    picture.setReadyFunc(false);

    Promise.resolve(texture.promise||texture)
        .then(function (tex) {
            picture.texture = tex;
            picture.texture.setTexCoords(picture.sprite);
            return tex.image.promise;
        })
        .then(() => picture.setReadyFunc(true));

}

