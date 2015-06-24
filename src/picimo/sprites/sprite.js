(function(){
    "use strict";

    var SpriteDescriptor = require( './sprite_descriptor' );

    /**
     * @class Picimo.sprites.Sprite
     * @extends Picimo.core.VertexObject
     * @classdesc
     * The default sprite class.
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     * @param {Picimo.core.VertexObjectPool} [pool] - Vertex object pool.
     */

    function Sprite () {

        return SpriteDescriptor.create.apply( SpriteDescriptor, arguments );
    
    }

    Sprite.prototype = SpriteDescriptor.proto;
    Sprite.prototype.constructor = Sprite;

    module.exports = Sprite;

})();
