(function(){
    "use strict";

    var BaseSprite       = require( './base_sprite' );
    var SpriteDescriptor = require( './sprite_descriptor' );

    /**
     * @class Picimo.sprites.Sprite
     * @extends Picimo.sprites.BaseSprite
     * @classdesc
     * The default sprite class.
     * @param {Picimo.core.VertexArray} [vertexArray=undefined] - The vertex array.
     * @param {Picimo.sprites.SpritePool} [pool=undefined] - The sprite pool.
     */

    function Sprite ( vertexArray, pool ) {

        BaseSprite.call( this, SpriteDescriptor, vertexArray, pool );

    }

    Sprite.prototype = Object.create( BaseSprite.prototype );
    Sprite.prototype.constructor = Sprite;

    Sprite.prototype.reset = function () {

        this.width  = 0;
        this.height = 0;
        this._z     = 0;

        this.scale        = 0;
        this.opacity      = 0;
        this.rotateRadian = 0;

        this.setTranslate(0, 0);
        this.setPositions(0,0,0, 0,0,0, 0,0,0, 0,0,0);

    };


    /**
     * @method Picimo.sprites.Sprite#setPositions
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
     * @return {Picimo.sprites.Sprite} - self
     */

    Sprite.prototype.setPositions = function (x0, y0, z0, x1, y1, z1, x2, y2, z2, x3, y3, z3) {

        var VERTEX_ATTR_COUNT    = this.descriptor.vertexAttrCount;
        var ATTR_OFFSET_POSITION = this.descriptor.attrOffsetPosition;
        var VERTICES             = this.vertexArray.vertices;

        VERTICES[                           ATTR_OFFSET_POSITION    ] = x0;
        VERTICES[                           ATTR_OFFSET_POSITION + 1] = y0;
        VERTICES[                           ATTR_OFFSET_POSITION + 2] = z0;
        VERTICES[     VERTEX_ATTR_COUNT  +  ATTR_OFFSET_POSITION    ] = x1;
        VERTICES[     VERTEX_ATTR_COUNT  +  ATTR_OFFSET_POSITION + 1] = y1;
        VERTICES[     VERTEX_ATTR_COUNT  +  ATTR_OFFSET_POSITION + 2] = z1;
        VERTICES[(2 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION    ] = x2;
        VERTICES[(2 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 1] = y2;
        VERTICES[(2 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 2] = z2;
        VERTICES[(3 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION    ] = x3;
        VERTICES[(3 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 1] = y3;
        VERTICES[(3 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 2] = z3;

        return this;

    };

    /**
     * @method Picimo.sprites.Sprite#setPosition2d
     * @param {number} x0 - x0
     * @param {number} y0 - y0
     * @param {number} x1 - x1
     * @param {number} y1 - y1
     * @param {number} x2 - x2
     * @param {number} y2 - y2
     * @param {number} x3 - x3
     * @param {number} y3 - y3
     * @return {Picimo.sprites.Sprite} - self
     */

    Sprite.prototype.setPosition2d = function (x0, y0, x1, y1, x2, y2, x3, y3) {

        var VERTEX_ATTR_COUNT    = this.descriptor.vertexAttrCount;
        var ATTR_OFFSET_POSITION = this.descriptor.attrOffsetPosition;
        var VERTICES             = this.vertexArray.vertices;

        VERTICES[                           ATTR_OFFSET_POSITION    ] = x0;
        VERTICES[                           ATTR_OFFSET_POSITION + 1] = y0;
        VERTICES[     VERTEX_ATTR_COUNT  +  ATTR_OFFSET_POSITION    ] = x1;
        VERTICES[     VERTEX_ATTR_COUNT  +  ATTR_OFFSET_POSITION + 1] = y1;
        VERTICES[(2 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION    ] = x2;
        VERTICES[(2 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 1] = y2;
        VERTICES[(3 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION    ] = x3;
        VERTICES[(3 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 1] = y3;

        return this;

    };

    Object.defineProperties( Sprite.prototype, {

        x0: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#x0 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.attrOffsetPosition ];
            },
            set: function (x0) {
                this.vertexArray.vertices[ this.descriptor.attrOffsetPosition ] = x0;
            }
        },

        y0: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#y0 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.attrOffsetPosition + 1 ];
            },
            set: function (y0) {
                this.vertexArray.vertices[ this.descriptor.attrOffsetPosition + 1 ] = y0;
            }
        },

        x1: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#x1 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetPosition ];
            },
            set: function (x1) {
                this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetPosition ] = x1;
            }
        },

        y1: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#y1 */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetPosition + 1 ];
            },
            set: function (y1) {
                this.vertexArray.vertices[ this.descriptor.vertexAttrCount + this.descriptor.attrOffsetPosition + 1 ] = y1;
            }
        },

        x2: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#x2 */
            get: function () {
                return this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition ];
            },
            set: function (x2) {
                this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition ] = x2;
            }
        },

        y2: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#y2 */
            get: function () {
                return this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition + 1 ];
            },
            set: function (y2) {
                this.vertexArray.vertices[ ( 2 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition + 1 ] = y2;
            }
        },

        x3: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#x3 */
            get: function () {
                return this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition ];
            },
            set: function (x3) {
                this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition ] = x3;
            }
        },

        y3: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#y3 */
            get: function () {
                return this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition + 1 ];
            },
            set: function (y3) {
                this.vertexArray.vertices[ ( 3 * this.descriptor.vertexAttrCount ) + this.descriptor.attrOffsetPosition + 1 ] = y3;
            }
        },

        z: {
            enumerable: true,

            /** @member {number} Picimo.sprites.Sprite#z */
            get: function () {
                return this._z;
            },

            set: function (z) {
                this._z = z;

                const VERTEX_ATTR_COUNT    = this.descriptor.vertexAttrCount;
                const ATTR_OFFSET_POSITION = this.descriptor.attrOffsetPosition;
                const VERTICES             = this.vertexArray.vertices;

                VERTICES[                           ATTR_OFFSET_POSITION + 2] = z;
                VERTICES[     VERTEX_ATTR_COUNT  +  ATTR_OFFSET_POSITION + 2] = z;
                VERTICES[(2 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 2] = z;
                VERTICES[(3 * VERTEX_ATTR_COUNT) +  ATTR_OFFSET_POSITION + 2] = z;
            }
        }

    });

    /**
     * @method Picimo.sprites.Sprite#setPositionsBySize
     * @param {number} width - width
     * @param {number} height - height
     * @return {Picimo.Sprite} - self
     */

    Sprite.prototype.setPositionsBySize = function (width, height) {

        this.width  = width;
        this.height = height;

        var half_width  = width * 0.5;
        var half_height = height * 0.5;

        this.setPositions(
                -half_width, -half_height, this._z,
                 half_width, -half_height, this._z,
                 half_width,  half_height, this._z,
                -half_width,  half_height, this._z
                );

        return this;

    };

    /**
     * @method Picimo.sprites.Sprite#setTranslate
     * @param {number} x - x
     * @param {number} y - y
     * @return {Picimo.sprites.Sprite} - self
     */

    Sprite.prototype.setTranslate = function (x, y) {

        var VERTEX_ATTR_COUNT     = this.descriptor.vertexAttrCount;
        var ATTR_OFFSET_TRANSLATE = this.descriptor.attrOffsetTranslate;
        var VERTICES              = this.vertexArray.vertices;

        VERTICES[                          ATTR_OFFSET_TRANSLATE    ] = x;
        VERTICES[                          ATTR_OFFSET_TRANSLATE + 1] = y;
        VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_TRANSLATE    ] = x;
        VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_TRANSLATE + 1] = y;
        VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE    ] = x;
        VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE + 1] = y;
        VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE    ] = x;
        VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE + 1] = y;

        return this;

    };

    Object.defineProperties( Sprite.prototype, {

        tx: {
            enumerable: true,

            /** @member {number} Picimo.Sprite#tx - translate x */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.attrOffsetTranslate ];
            },

            set: function (x) {

                var VERTEX_ATTR_COUNT     = this.descriptor.vertexAttrCount;
                var ATTR_OFFSET_TRANSLATE = this.descriptor.attrOffsetTranslate;
                var VERTICES              = this.vertexArray.vertices;

                VERTICES[                          ATTR_OFFSET_TRANSLATE] = x;
                VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_TRANSLATE] = x;
                VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE] = x;
                VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE] = x;
            }
        },

        ty: {
            enumerable: true,

            /** @member {number} Picimo.Sprite#ty - translate y */
            get: function () {
                return this.vertexArray.vertices[ this.descriptor.attrOffsetTranslate + 1 ];
            },

            set: function (y) {

                var VERTEX_ATTR_COUNT     = this.descriptor.vertexAttrCount;
                var ATTR_OFFSET_TRANSLATE = this.descriptor.attrOffsetTranslate;
                var VERTICES              = this.vertexArray.vertices;

                VERTICES[                          ATTR_OFFSET_TRANSLATE + 1] = y;
                VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_TRANSLATE + 1] = y;
                VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE + 1] = y;
                VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_TRANSLATE + 1] = y;
            }
        },

        rotateDegree: {
            enumerable: true,

            /** @member {number} Picimo.Sprite#rotateDegree - rotation in degree */
            get: function () {
                return this.vertexArray.vertices[this.descriptor.attrOffsetRotate] * 180.0 / Math.PI;
            },

            set: function (degree) {
                this.rotateRadian = degree * ( Math.PI / 180.0 );
            }
        },

        rotateRadian: {
            enumerable: true,

            /** @member {number} Picimo.Sprite#rotateRadian - rotation in radian */
            get: function () {
                return this.vertexArray.vertices[this.descriptor.attrOffsetRotate];
            },

            set: function (radian) {
                var VERTEX_ATTR_COUNT  = this.descriptor.vertexAttrCount;
                var ATTR_OFFSET_ROTATE = this.descriptor.attrOffsetRotate;
                var VERTICES           = this.vertexArray.vertices;

                VERTICES[                          ATTR_OFFSET_ROTATE] = radian;
                VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_ROTATE] = radian;
                VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_ROTATE] = radian;
                VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_ROTATE] = radian;
            }
        }

    });

    /**
     * @method Picimo.sprite.Sprite#setRotate
     * @param {number} degree - degree
     * @return self
     */
    Sprite.prototype.setRotate = function (degree) {
        this.rotateDegree = degree;
        return this;
    };

    Object.defineProperty( Sprite.prototype, 'scale', {

        enumerable: true,

        /** @member {number} Picimo.sprites.Sprite#scale - scale */
        get: function () {
            return this.vertexArray.vertices[this.descriptor.attrOffsetScale];
        },

        set: function (scale) {
            var VERTEX_ATTR_COUNT = this.descriptor.vertexAttrCount;
            var ATTR_OFFSET_SCALE = this.descriptor.attrOffsetScale;
            var VERTICES          = this.vertexArray.vertices;

            VERTICES[                          ATTR_OFFSET_SCALE] = scale;
            VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_SCALE] = scale;
            VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_SCALE] = scale;
            VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_SCALE] = scale;
        }

    });

    /**
     * @method Picimo.sprite.Sprite#setScale
     * @param {number} scale - scale
     * @return self
     */
    Sprite.prototype.setScale = function (scale) {
        this.scale = scale;
        return this;
    };

    Object.defineProperty( Sprite.prototype, 'opacity', {

        enumerable: true,

        /** @member {number} Picimo.Sprite#opacity - opacity */
        get: function () {
            return this.vertexArray.vertices[this.descriptor.attrOffsetOpacity];
        },

        set: function (opacity) {
            const VERTEX_ATTR_COUNT   = this.descriptor.vertexAttrCount;
            const ATTR_OFFSET_OPACITY = this.descriptor.attrOffsetOpacity;
            const VERTICES            = this.vertexArray.vertices;

            VERTICES[                          ATTR_OFFSET_OPACITY] = opacity;
            VERTICES[     VERTEX_ATTR_COUNT  + ATTR_OFFSET_OPACITY] = opacity;
            VERTICES[(2 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_OPACITY] = opacity;
            VERTICES[(3 * VERTEX_ATTR_COUNT) + ATTR_OFFSET_OPACITY] = opacity;
        }
    });

    /**
     * @method Picimo.sprites.Sprite#setOpacity
     * @param {number} opacity - opacity
     * @return self
     */
    Sprite.prototype.setOpacity = function (opacity) {
        this.opacity = opacity;
        return this;
    };

    /**
     * @method Picimo.sprites.Sprite#setZ
     * @param {number} z - z
     * @return self
     */
    Sprite.prototype.setZ = function (z) {
        this.z = z;
        return this;
    };


    module.exports = Sprite;

})();
