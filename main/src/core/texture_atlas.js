import PowerOfTwoImage from './power_of_two_image';
import Resource from './resource';
import Texture from './texture';

/**
 * Represents a texture atlas definition and holds references to the image, frames and textures.
 */
export default class TextureAtlas extends Resource {

    /**
     * @param {App} app
     * @param {string} imageUrl
     * @param {string|Object} conf
     */
    constructor (app, imageUrl, conf) {

        super(app, 'conf');

        this.on('incomingData', toJson);
        this.on('data', parseTextureAtlasDefinition);

        /**
         * The texture atlas definition
         * @type {Object}
         */
        this.conf = conf;

        /**
         * The root texture
         * @type {Texture}
         */
        this.texture = null;

        /**
         * @type {Map<Texture>}
         */
        this.frames = null;

        /**
         * All texture frame names
         * @type {string[]}
         */
        this.frameNames = null;

        /**
         * @type {string}
         */
        this.imageUrl = imageUrl;

        Object.seal(this);

    }

    /**
     * Return texture by frame name
     * @param {string} name
     * @return {Texture} texture
     */
    getTexture (name) {

        if ( this.frames ) {

            return this.frames.get( name );

        }

    }

    /**
     * @return {Texture} texture
     */
    getRandomTexture () {

        if ( this.frames ) {

            return this.frames.get( this.frameNames[ parseInt( this.frameNames.length * Math.random(), 10 ) ] );

        }

    }

} // => class TextureAtlas


/**
 * @ignore
 */
function toJson (data) {
    return typeof data === 'string' ? JSON.parse( data ) : data;
}

/**
 * @ignore
 */
function constructImageUrl (textureAtlas, imageUrl) {

    if ( textureAtlas.imageUrl !== undefined ) {

        return textureAtlas.imageUrl;

    }

    return textureAtlas.app.joinAssetUrl( textureAtlas.url, imageUrl );

}

/**
 * @ignore
 */
function parseTextureAtlasDefinition (conf) {

    this.texture = new Texture();

    this.texture.width  = conf.meta.size.w;
    this.texture.height = conf.meta.size.h;
    this.texture.image  = new PowerOfTwoImage( this.app ).load( constructImageUrl( this, conf.meta.image ) );

    this.frameNames = [];
    this.frames = new Map;

    var name, frame;

    for ( name in conf.frames ) {

        if ( conf.frames.hasOwnProperty( name ) ) {

            this.frameNames.push( name );
            frame = conf.frames[ name ].frame;
            this.frames.set( name, new Texture( this.texture, frame.x, frame.y, frame.w, frame.h ) );

        }

    }

}

