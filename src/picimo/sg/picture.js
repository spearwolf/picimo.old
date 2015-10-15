'use strict';

var Node            = require( './node' );
var core            = require( '../core' );
var utils           = require( '../utils' );
var sprites         = require( '../sprites' );
var PicturePipeline = require( '../webgl/pipeline' ).PicturePipeline;

/**
 * @class Picimo.sg.Picture
 * @extends Picimo.sg.Node
 *
 * @param {Picimo.App} app - The app instance
 * @param {Object} [options] - The options
 * @param {Picimo.core.TextureAtlas|Picimo.utils.Promise} [options.textureAtlas]
 * @param {string} [options.program="picture"] - The webgl program name
 * @param {Picimo.core.VertexObjectDescriptor} [options.spriteDescriptor=Picimo.sprites.SpriteDescriptor]
 *
 * @summary
 * Represents a single picture.
 *
 * @classdesc
 * A Picture renders an single image to the screen.
 * All vertex data will be will be uploaded to the GPU *every frame*.
 *
 */

export default function Picture ( app, options ) {

    if ( options === undefined ) options = {};

    Node.call( this, app, options );

    initTextureAtlas( this, options.textureAtlas );

    this.program          = options.program || "sprite";
    this.spriteDescriptor = options.spriteDescriptor || sprites.SpriteDescriptor;
    this.pipeline         = null;

    initSpritePool( this, this.spriteDescriptor, options.capacity || 1000 );

    this.on( "initGl", onInitGl.bind( this, this ) );
    this.on( "renderFrame", -1000, onRenderFrame.bind( this, this ) );

}

Picture.prototype = Object.create( Node.prototype );
Picture.prototype.constructor = Picture;


/**
 * @method Picimo.sg.Picture#createSprite
 *
 * @param {string|Picimo.core.Texture} [texture]
 * @param {number} [width]
 * @param {number} [height]
 *
 * @returns {Picimo.sprites.Sprite} sprite
 *
 * @throws  If pool capacity is reached an error will be thrown.
 *
 * @description
 * Returns a sprite from the internal sprite pool. If pool capacity is reached an error will be thrown.
 *
 * If no *width* or *height* given the size will be read out from the texture.
 * Otherwise when you previously called `setDefaultSpriteSize(w, h)` the default width and height will be used.
 *
 * If no *texture* is given a random texture (from the *textureAtlas*) will be choosen.
 *
 */

Picture.prototype.createSprite = function ( texture, width, height ) {

    var sprite = this.pool.alloc();

    var tex = typeof texture === 'string'
        ? this.textureAtlas.getTexture( texture )
        : ( texture == null
            ? this.textureAtlas.getRandomTexture()
            : texture );

    tex.setTexCoords( sprite );

    if ( width === undefined ) {

        if ( ! tex ) {

            return sprite;

        }

        width = tex.width;
        height = tex.height;

    } else {

        if ( height === undefined ) height = width;

    }

    sprite.setSize( width, height );

    return sprite;

};


function initSpritePool ( spriteGroup, descriptor, capacity ) {

    spriteGroup.pool = new core.VertexObjectPool( descriptor, capacity );

    var newSpritePrototype = spriteGroup.pool.NEW;

    if ( descriptor.hasAttribute( 'scale', 1 ) ) newSpritePrototype.scale = 1;
    else if ( descriptor.hasAttribute( 'scale', 2 ) ) newSpritePrototype.setScale( 1, 1 );
    if ( descriptor.hasAttribute( 'opacity' ) ) newSpritePrototype.opacity = 1;

}

function initTextureAtlas ( spriteGroup, textureAtlas ) {

    spriteGroup.textureAtlas = null;
    spriteGroup.setReadyFunc( false );

    utils.Promise.resolve( textureAtlas )

        .then( function ( atlas ) {

                spriteGroup.textureAtlas = atlas;
                return atlas.deferred.promise;

            })

        .then ( function ( atlas ) { return atlas.texture.image.deferred.promise; })
        .then ( function () { spriteGroup.setReadyFunc( true ); })
        ;

}

function onInitGl ( spriteGroup ) {

    spriteGroup.pipeline = new PicturePipeline( spriteGroup.app, spriteGroup.program, spriteGroup.pool, spriteGroup.textureAtlas );
    spriteGroup.pipeline.onInitGl();
    spriteGroup.app.renderer.addPipeline( spriteGroup.pipeline );

}

function onRenderFrame ( spriteGroup ) {

    spriteGroup.pipeline.render();

}

Object.defineProperties( Picture.prototype, {

    "textureAtlas": {

        get: function () { return this._textureAtlas; },

        set: function ( ta ) {

            this._textureAtlas = ta;

            if ( ta instanceof core.TextureAtlas ) {

                this.ready = true;

            } else {

                this.ready = false;

                if ( ta && ta.then ) {

                    var self = this;

                    ta.then( function ( ta_ ) {

                        self.textureAtlas = ta_;

                    });

                }

            }

        }

    },

});


//module.exports = Picture;

