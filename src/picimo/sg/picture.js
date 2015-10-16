'use strict';

import Node from './node';
//import core from '../core';
//import sprites from '../sprites';
//import {PicturePipeline} from '../webgl/pipeline';

/**
 * @class Picimo.sg.Picture
 * @extends Picimo.sg.Node
 *
 * @param {Picimo.App} app - The app instance
 * @param {object} [options] - The options
 * @param {Picimo.core.Texture|Promise} [options.texture]
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

    constructor ( app, options ) {

        if (options === undefined) options = {};

        super(app, options);

        initTexture(this, options.texture);

        this.program  = options.program || "picture";
        this.pipeline = null;

        // TODO initialize sprite

        this.on( "initGl", onInitGl.bind(this, this) );
        this.on( "renderFrame", -1000, onRenderFrame.bind(this, this) );

    }

}

//Picture.prototype = Object.create( Node.prototype );
//Picture.prototype.constructor = Picture;


function onInitGl ( picture ) {

    //spriteGroup.pipeline = new PicturePipeline( spriteGroup.app, spriteGroup.program, spriteGroup.pool, spriteGroup.textureAtlas );
    //spriteGroup.pipeline.onInitGl();
    //spriteGroup.app.renderer.addPipeline( spriteGroup.pipeline );

}

function onRenderFrame ( picture ) {

    //spriteGroup.pipeline.render();

}

function initTexture ( picture, texture ) {

    picture.texture = null;
    picture.setReadyFunc(false);

    Promise.resolve(texture)
        .then(function ( tex ) {
            picture.texture = tex;
            return texture.image.promise;
        })
        .then(() => picture.setReadyFunc(true));

}

