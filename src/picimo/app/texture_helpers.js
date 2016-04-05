'use strict';

import * as core from '../core';

//-----------------------------------------------------
// loadTextureAtlas( url ) -> promise<TextureAtlas>
//--------------------------------------------------------

export function loadTextureAtlas ( url ) {

    return new core.TextureAtlas( this ).load( url ).promise;

}


//-----------------------------------------------------
// loadTexture( url ) -> promise<Texture>
//
// Load an image and create a texture from image data
//--------------------------------------------------------

export function loadTexture ( url ) {

    var image = new core.Po2Image( this ).load( url );

    var texture = new core.Texture();
    texture.image = image;

    return image.promise.then(() => texture);

}

