(function () {
    "use strict";

    var Node                = require( './node' );
    var core                = require( '../core' );
    var utils               = require( '../utils' );
    var sprites             = require( '../sprites' );
    var SpriteGroupPipeline = require( '../webgl/pipeline' ).SpriteGroupPipeline;

    /**
     * @class Picimo.sg.SpriteGroup
     * @extends Picimo.sg.Node
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {Picimo.core.TextureAtlas|Picimo.utils.Promise} [options.textureAtlas] - The texture atlas
     * @param {string} [options.program="sprite"] - The webgl program name
     * @param {number} [options.capacity=1000] - Max sprite capacity
     * @param {Picimo.core.VertexObjectDescriptor} [options.spriteDescriptor=Picimo.sprites.SpriteDescriptor] - The sprite descriptor
     *
     */

    function SpriteGroup ( app, options ) {

        if ( options === undefined ) options = {};

        Node.call( this, app, options );

        initTextureAtlas( this, options.textureAtlas );

        this.program             = options.program || "sprite";
        this.spriteDescriptor    = options.spriteDescriptor || sprites.SpriteDescriptor;
        this.pipeline            = null;
        this.defaultSpriteWidth  = options.defaultWidth || 0;
        this.defaultSpriteHeight = options.defaultHeight || options.defaultWidth;

        initSpritePool( this, this.spriteDescriptor, options.capacity || 1000 );

        this.on( "initGl", onInitGl.bind( this, this ) );
        this.on( "renderFrame", -1000, onRenderFrame.bind( this, this ) );

    }

    SpriteGroup.prototype = Object.create( Node.prototype );
    SpriteGroup.prototype.constructor = SpriteGroup;


    /**
     * @method Picimo.sg.SpriteGroup#createSprite
     * @param {string|Picimo.core.Texture} [texture]
     * @param {number} [width]
     * @param {number} [height]
     * @return {Picimo.sprites.Sprite} sprite
     */

    SpriteGroup.prototype.createSprite = function ( texture, width, height ) {

        var sprite = this.pool.alloc();

        var tex = typeof texture === 'string'
            ? this.textureAtlas.getTexture( texture )
            : ( texture == null
                ? this.textureAtlas.getRandomTexture()
                : texture );

        tex.setTexCoords( sprite );

        if ( width === undefined ) {

            if ( this.hasDefaultSpriteSize ) {
            
                return sprite;
            
            }

            width = tex.width;
            height = tex.height;
        
        } else {

            if ( height === undefined ) height = width;
        
        }

        sprite.setPositionBySize( width, height );

        return sprite;

    };

    /**
     * @method Picimo.sg.SpriteGroup#setDefaultSpriteSize
     * @param {number} width
     * @param {number} height
     * @return self
     */

    SpriteGroup.prototype.setDefaultSpriteSize = function ( width, height ) {

        this.defaultSpriteWidth = width || 0;
        this.defaultSpriteHeight = height || width;

        updateDefaultSpriteSize( this );

    };


    function initSpritePool ( spriteGroup, descriptor, capacity ) {

        spriteGroup.pool = new core.VertexObjectPool( descriptor, capacity );

        var newSpritePrototype = spriteGroup.pool.NEW;

        newSpritePrototype.scale = 1;
        newSpritePrototype.opacity = 1;

        updateDefaultSpriteSize( spriteGroup );

    }

    function updateDefaultSpriteSize ( spriteGroup ) {

        if ( spriteGroup.hasDefaultSpriteSize ) {

            spriteGroup.pool.NEW.setPositionBySize( spriteGroup.defaultSpriteWidth, spriteGroup.defaultSpriteHeight );
        
        }

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

        spriteGroup.pipeline = new SpriteGroupPipeline( spriteGroup.app, spriteGroup.program, spriteGroup.pool, spriteGroup.textureAtlas );
        spriteGroup.pipeline.onInitGl();
        spriteGroup.app.renderer.addPipeline( spriteGroup.pipeline );

    }

    function onRenderFrame ( spriteGroup ) {

        spriteGroup.pipeline.render();

    }

    Object.defineProperties( SpriteGroup.prototype, {

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

        'hasDefaultSpriteSize': {

            get: function () {

                return this.defaultSpriteWidth > 0 && this.defaultSpriteHeight > 0;

            }

        }

    });


    module.exports = SpriteGroup;

})();
