(function(){
    "use strict";

    var core = require( "../core" );

    var SpriteDescriptor = new core.VertexObjectDescriptor(

        null,

        4,
        12,

        [

            /**
             * @method Picimo.sprites.Sprite#setPosition
             * @param {number} x0 - x0
             * @param {number} y0 - y0
             * @param {number} z0 - z0
             * @param {number} x1 - x1
             * @param {number} y1 - y1
             * @param {number} z1 - z1
             * @param {number} x2 - x2
             * @param {number} y2 - y2
             * @param {number} z2 - z2
             * @param {number} x3 - x3
             * @param {number} y3 - y3
             * @param {number} z3 - z3
             */

            /** @member {number} Picimo.sprites.Sprite#x0 */
            /** @member {number} Picimo.sprites.Sprite#y0 */
            /** @member {number} Picimo.sprites.Sprite#z0 */
            /** @member {number} Picimo.sprites.Sprite#x1 */
            /** @member {number} Picimo.sprites.Sprite#y1 */
            /** @member {number} Picimo.sprites.Sprite#z1 */
            /** @member {number} Picimo.sprites.Sprite#x2 */
            /** @member {number} Picimo.sprites.Sprite#y2 */
            /** @member {number} Picimo.sprites.Sprite#z2 */
            /** @member {number} Picimo.sprites.Sprite#x3 */
            /** @member {number} Picimo.sprites.Sprite#y3 */
            /** @member {number} Picimo.sprites.Sprite#z3 */

            { name: 'position', size: 3, attrNames: [ 'x', 'y', 'z' ] },

            /**
             * @member {number} Picimo.sprites.Sprite#rotate - rotation (radian)
             */

            { name: 'rotate', size: 1, uniform: true },

            /**
             * @method Picimo.sprites.Sprite#setTexCoords
             * @param {number} s0 - s0
             * @param {number} t0 - t0
             * @param {number} s1 - s1
             * @param {number} t1 - t1
             * @param {number} s2 - s2
             * @param {number} t2 - t2
             * @param {number} s3 - s3
             * @param {number} t3 - t3
             */

            /** @member {number} Picimo.sprites.Sprite#s0 */
            /** @member {number} Picimo.sprites.Sprite#t0 */
            /** @member {number} Picimo.sprites.Sprite#s1 */
            /** @member {number} Picimo.sprites.Sprite#t1 */
            /** @member {number} Picimo.sprites.Sprite#s2 */
            /** @member {number} Picimo.sprites.Sprite#t2 */
            /** @member {number} Picimo.sprites.Sprite#s3 */
            /** @member {number} Picimo.sprites.Sprite#t3 */

            { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },

            /**
             * @method Picimo.sprites.Sprite#setTranslate
             * @param {number} tx - tx
             * @param {number} ty - ty
             */

            /** @member {number} Picimo.sprites.Sprite#tx - translate x */
            /** @member {number} Picimo.sprites.Sprite#ty - translate y */

            { name: 'translate', size: 2, uniform: true, attrNames: [ 'tx', 'ty' ] },

            /**
             * @member {number} Picimo.sprites.Sprite#scale - scale
             */

            { name: 'scale', size: 1, uniform: true },

            /**
             * @member {number} Picimo.sprites.Sprite#opacity - opacity
             */

            { name: 'opacity', size: 1, uniform: true }

        ],

        {

            /**
             * @method Picimo.sprites.Sprite#setPos2d
             * @param {number} x0 - x0
             * @param {number} y0 - y0
             * @param {number} x1 - x1
             * @param {number} y1 - y1
             * @param {number} x2 - x2
             * @param {number} y2 - y2
             * @param {number} x3 - x3
             * @param {number} y3 - y3
             */

            pos2d: { size: 2, offset: 0 },

            /**
             * @member {number} Picimo.sprites.Sprite#posZ
             */

            posZ:  { size: 1, offset: 2, uniform: true },

            uv:    'texCoords'

        }

    );

    require( './sprite_helpers' )( SpriteDescriptor.proto );

    module.exports = SpriteDescriptor;

})();
