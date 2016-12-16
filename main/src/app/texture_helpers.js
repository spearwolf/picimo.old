import { PowerOfTwoImage, Texture, TextureAtlas } from '../core';

/**
 * @param {string} url
 * @return {Promise<TextureAtlas>}
 */

export function loadTextureAtlas ( url ) {

    return new TextureAtlas( this ).load( url ).promise;

}


/**
 * Load an image and create a _texture_ from the image bitmap data.
 *
 * @param {string} url
 * @return {Promise<Texture>}
 */

export function loadTexture ( url ) {

    var image = new PowerOfTwoImage( this ).load( url );

    var texture = new Texture();
    texture.image = image;

    return image.promise.then(() => texture);

}


//function forwardTexture ( texture, image ) {

    //var el = image.domElement;

    //if (el.width !== texture.width || el.height !== texture.height) {
        //return new core.Texture( texture, 0, 0, el.width, el.height );
    //}

    //return texture;

//}

