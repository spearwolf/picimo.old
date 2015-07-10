(function (){
    "use strict";

    var Node  = require( './node' );
    //var utils = require( '../utils' );
    var core  = require( '../core' );

    /**
     * @class Picimo.sg.SpriteGroup
     * @extends Picimo.sg.Node
     *
     * @param {Picimo.App} app - The app instance
     * @param {Object} [options] - The options
     * @param {Picimo.core.TextureAtlas|Picimo.utils.Promise} [options.textureAtlas] - The texture atlas
     *
     */

    function SpriteGroup ( app, options ) {

        if ( options === undefined ) options = {};

        Node.call( this, app, options );

        this.textureAtlas = options.textureAtlas;

        //this.on( "init", onInit.bind( this, this ) );

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
