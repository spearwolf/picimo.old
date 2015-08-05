(function (){
    "use strict";

    var Node    = require( './node' );
    //var utils   = require( '../utils' );
    var core    = require( '../core' );
    var sprites = require( '../sprites' );

    /**
     * @class Picimo.sg.SpriteGroup
     * @extends Picimo.sg.Node
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {Picimo.core.TextureAtlas|Picimo.utils.Promise} [options.textureAtlas] - The texture atlas
     * @param {Picimo.core.VertexObjectDescriptor} [options.spriteDescriptor=Picimo.sprites.SpriteDescriptor] - The sprite descriptor
     * @param {number} [options.capacity=1000] - Max sprite capacity
     *
     */

    function SpriteGroup ( app, options ) {

        if ( options === undefined ) options = {};

        Node.call( this, app, options );

        this.textureAtlas     = options.textureAtlas;
        this.spriteDescriptor = options.spriteDescriptor || sprites.SpriteDescriptor;
        this.pool             = new core.VertexObjectPool( this.spriteDescriptor, options.capacity || 1000 );

    }

    SpriteGroup.prototype = Object.create( Node.prototype );
    SpriteGroup.prototype.constructor = SpriteGroup;


    //function onInit ( spriteGroup, done ) {

        //var p = spriteGroup.deferred.promise;  //utils.Promise.resolve( spriteGroup.textureAtlas );

        //p.then( function ( ta ) {
            
            //console.debug( "TextureAtlas", ta );

        //});
    
        //done( p );

    //}

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
