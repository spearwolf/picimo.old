(function (){
    "use strict";

    var Node                = require( './node' );
    var core                = require( '../core' );
    var sprites             = require( '../sprites' );
    var SpriteGroupPipeline = require( '../webgl/pipeline' ).SpriteGroupPipeline;

    /**
     * @class Picimo.sg.SpriteGroup
     * @extends Picimo.sg.Node
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {Picimo.core.TextureAtlas|Picimo.utils.Promise} [options.textureAtlas] - The texture atlas
     * @param {string} [options.program="spriteGroup"] - The webgl program name
     * @param {Picimo.core.VertexObjectDescriptor} [options.spriteDescriptor=Picimo.sprites.SpriteDescriptor] - The sprite descriptor
     * @param {number} [options.capacity=1000] - Max sprite capacity
     *
     */

    function SpriteGroup ( app, options ) {

        if ( options === undefined ) options = {};

        Node.call( this, app, options );

        this.textureAtlas     = options.textureAtlas;
        this.program          = options.program || "spriteGroup";
        this.spriteDescriptor = options.spriteDescriptor || sprites.SpriteDescriptor;
        this.pool             = new core.VertexObjectPool( this.spriteDescriptor, options.capacity || 1000 );
        this.pipeline         = null;

        this.on( "initGl", onInitGl.bind( this, this ) );
        this.on( "renderFrame", onRenderFrame.bind( this, this ) );

    }

    SpriteGroup.prototype = Object.create( Node.prototype );
    SpriteGroup.prototype.constructor = SpriteGroup;

    function onInitGl ( spriteGroup ) {

        spriteGroup.pipeline = new SpriteGroupPipeline( spriteGroup.app, spriteGroup.program, spriteGroup.pool );
        spriteGroup.pipeline.initGl();
        spriteGroup.app.renderer.addPipeline( spriteGroup.pipeline );

    }

    function onRenderFrame ( spriteGroup ) {

        //if ( spriteGroup.app.frameNo === 120 ) {
        
            //console.log( 'SpriteGroup->renderFrame' );
        
        //}

    }

    Object.defineProperties( SpriteGroup.prototype, {
    
        "textureAtlas": {

            get: function () { return this._textureAtlas; },

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
        
        }
    
    });


    module.exports = SpriteGroup;

})();
