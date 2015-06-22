(function(){
    "use strict";

    /**
     * @class Picimo.sprites.BaseSprite
     * @classdesc
     * The sprite base class.
     * @param {Picimo.core.VertexArrayDescriptor} descriptor - The descriptor.
     * @param {Picimo.core.VertexArray} [vertexArray=undefined] - The vertex array.
     * @param {Picimo.sprites.SpritePool} [pool=undefined] - The sprite pool.
     */

    function BaseSprite ( descriptor, vertexArray, pool ) {

        /** @member {Picimo.core.VertexArrayDescriptor} Picimo.sprites.BaseSprite#descriptor - The sprite descriptor. */
        this.descriptor = descriptor;

        /** @member {Picimo.sprites.SpritePool} Picimo.sprites.BaseSprite#pool - The sprite pool or _undefined_. */
        this.pool = ! pool ? null : pool;

        /** @member {Picimo.core.VertexArray} Picimo.sprites.BaseSprite#vertexArray - The vertex array. */
        this.vertexArray = ( !! vertexArray ) ? vertexArray : descriptor.createVertexArray();

        this.reset();

    }

    BaseSprite.prototype.destroy = function () {

        if ( this.pool ) {

            this.pool.freeSprite( this );

        } else {

            this.reset();

        }

    };

    /**
     * @method Picimo.sprites.BaseSprite#setTexCoords
     * @param {number} s0 - s0
     * @param {number} t0 - t0
     * @param {number} s1 - s1
     * @param {number} t1 - t1
     * @param {number} s2 - s2
     * @param {number} t2 - t2
     * @param {number} s3 - s3
     * @param {number} t3 - t3
     * @return self
     */

    BaseSprite.prototype.setTexCoords = function ( s0, t0, s1, t1, s2, t2, s3, t3 ) {

        var VERTEX_ATTR_COUNT      = this.descriptor.vertexAttrCount;
        var ATTR_OFFSET_TEX_COORDS = this.descriptor.attrOffsetTexCoords;
        var VERTICES               = this.vertexArray.vertices;

        VERTICES[                          ATTR_OFFSET_TEX_COORDS    ] = s0;
        VERTICES[                          ATTR_OFFSET_TEX_COORDS + 1] = t0;
        VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_TEX_COORDS    ] = s1;
        VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_TEX_COORDS + 1] = t1;
        VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TEX_COORDS    ] = s2;
        VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TEX_COORDS + 1] = t2;
        VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TEX_COORDS    ] = s3;
        VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TEX_COORDS + 1] = t3;

        return this;

    };

    Object.defineProperties( BaseSprite.prototype, {

        s0: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#s0 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.attrOffsetTexCoords ];
            },
            set: function (s0) {
                this.vertexArray.vertices[ this.descriptor.attrOffsetTexCoords ] = s0;
            }
        },

        s1: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#s1 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetTexCoords ];
            },
            set: function (s1) {
                this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetTexCoords ] = s1;
            }
        },

        s2: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#s2 */
            get: function () {
                return this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords ];
            },
            set: function (s2) {
                this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords ] = s2;
            }
        },

        s3: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#s3 */
            get: function () {
                return this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords ];
            },
            set: function (s3) {
                this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords ] = s3;
            }
        },

        t0: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#t0 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.attrOffsetTexCoords + 1 ];
            },
            set: function (t0) {
                this.vertexArray.vertices[ this.descriptor.attrOffsetTexCoords + 1 ] = t0;
            }
        },

        t1: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#t1 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetTexCoords + 1 ];
            },
            set: function (t1) {
                this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetTexCoords + 1 ] = t1;
            }
        },

        t2: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#t2 */
            get: function () {
                return this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords + 1 ];
            },
            set: function (t2) {
                this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords + 1 ] = t2;
            }
        },

        t3: {
            enumerable: true,

            /** @member {number} Picimo.sprites.BaseSprite#t3 */
            get: function () {
                return this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords + 1 ];
            },
            set: function (t3) {
                this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetTexCoords + 1 ] = t3;
            }
        }

    });

    /**
     * @method Picimo.sprites.BaseSprite#setTexCoordsByViewport
     * @param {Picimo.core.Viewport} viewport - viewport
     * @param {number} textureWidth - texture width
     * @param {number} textureHeight - texture height
     * @param {number} [repeat] - texture repeat factor
     * @return self
     */

    BaseSprite.prototype.setTexCoordsByViewport = function ( viewport, textureWidth, textureHeight, repeat ) {

        var x0 = viewport.x === 0 ? 0 : (viewport.x / textureWidth);
        var x1 = (viewport.x + viewport.width) / textureWidth;
        var y0 = 1 - ((viewport.y + viewport.height) / textureHeight);
        var y1 = viewport.y === 0 ? 1 : 1 - (viewport.y / textureHeight);

        if (typeof repeat === 'number') {
            x0 *= repeat;
            x1 *= repeat;
            y0 *= repeat;
            y1 *= repeat;
        }

        this.setTexCoords(
            x0, y0,
            x1, y0,
            x1, y1,
            x0, y1 );

        return this;

    };

    /**
     * @method Picimo.sprites.BaseSprite#setTexCoordsByFrame
     * @param {Picimo.tex.TextureAtlas.TextureAtlasFrame} frame - texture atlas frame
     * @return self
     */

    BaseSprite.prototype.setTexCoordsByFrame = function ( frame ) {

        return this.setTexCoordsByViewport(frame, frame.atlas.textureWidth, frame.atlas.textureHeight);

    };


    module.exports = BaseSprite;

})();
