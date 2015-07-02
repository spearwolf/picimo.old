(function(){
    "use strict";

    var utils    = require( '../utils' );
    var Resource = require( './resource' );
    var Texture  = require( './texture' );


    /**
     * @class Picimo.core.TextureAtlas
     * @extends Picimo.core.Resource
     * @param {Picimo.App} app
     * @param {String|Object} conf
     */

    function TextureAtlas ( app, conf ) {

        Resource.call( this, app, 'conf' );

        /**
         * @member {Object} Picimo.core.TextureAtlas#conf - The texture atlas configuration.
         */
        this.conf = conf;

        this.frameNames = null;
        this.texture = null;
        this.frames = null;

        Object.seal( this );

    }

    TextureAtlas.prototype = Object.create( Resource.prototype );
    TextureAtlas.prototype.constructor = TextureAtlas;


    TextureAtlas.prototype.convertToData = function ( conf ) {

        if ( typeof conf === 'string' ) {

            return JSON.parse( conf );

        } else {

            return conf;

        }

    };


    TextureAtlas.prototype.parseData = function ( conf ) {

        this.texture = new Texture();
        this.texture.width = conf.meta.size.w;
        this.texture.height = conf.meta.size.h;

        this.frameNames = [];
        this.frames = new utils.Map();

        var name, frame;

        for ( name in conf.frames ) {
        
            if ( conf.frames.hasOwnProperty( name ) ) {

                this.frameNames.push( name );

                frame = conf.frames[ name ].frame;

                this.frames.set( name, new Texture( this.texture, frame.x, frame.y, frame.w, frame.h ) );
            
            }
        
        }

    };


    TextureAtlas.prototype.getTexture = function ( name ) {

        if ( this.frames ) {

            return this.frames.get( name );
        
        }

    };


    module.exports = TextureAtlas;

})();
