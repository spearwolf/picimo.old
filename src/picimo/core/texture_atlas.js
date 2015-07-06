(function(){
    "use strict";

    var utils    = require( '../utils' );
    var Resource = require( './resource' );
    var Texture  = require( './texture' );
    var Po2Image = require( './po2image' );


    /**
     * @class Picimo.core.TextureAtlas
     * @extends Picimo.core.Resource
     * @param {Picimo.App} app
     * @param {String} imageUrl
     * @param {String|Object} conf
     */

    function TextureAtlas ( app, imageUrl, conf ) {

        Resource.call( this, app, 'conf' );

        /**
         * @member {Object} Picimo.core.TextureAtlas#conf - The texture atlas configuration.
         */
        this.conf = conf;

        this.frameNames = null;
        this.texture = null;
        this.frames = null;
        this.imageUrl = imageUrl;

        Object.seal( this );

    }

    TextureAtlas.prototype = Object.create( Resource.prototype );
    TextureAtlas.prototype.constructor = TextureAtlas;


    TextureAtlas.prototype.convertData = function ( data ) {

        return typeof data === 'string' ? JSON.parse( data ) : data;

    };


    TextureAtlas.prototype.getImageUrl = function ( url ) {
    
        var isAbsUrl = new RegExp( '^(https?:)?/', 'i' );

        if ( this.imageUrl !== undefined ) {

            return this.imageUrl;
        
        }

        if ( isAbsUrl.test( url ) ) {
        
            return url;

        }

        return getUrlDir( this.url ) + url;
    
    };


    var urlDirRegExp = new RegExp( '^(.*/)[^/]+$', 'i' );

    function getUrlDir( url ) {
    
        return urlDirRegExp.exec( url )[ 1 ];
    
    }


    TextureAtlas.prototype.onData = function ( conf ) {

        this.texture = new Texture();

        this.texture.width  = conf.meta.size.w;
        this.texture.height = conf.meta.size.h;
        this.texture.image  = new Po2Image( this.app ).load( this.getImageUrl( conf.meta.image ) );

        this.frameNames = [];
        this.frames     = new utils.Map();

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
