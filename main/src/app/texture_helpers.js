import { PowerOfTwoImage, Texture, TextureAtlas } from '../core';

//-----------------------------------------------------
// loadTextureAtlas( url ) -> promise<TextureAtlas>
//--------------------------------------------------------

export function loadTextureAtlas ( url ) {

    return new TextureAtlas( this ).load( url ).promise;

}


//-----------------------------------------------------
// loadTexture( url ) -> promise<Texture>
//
// Load an image and create a texture from image data
//--------------------------------------------------------

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

