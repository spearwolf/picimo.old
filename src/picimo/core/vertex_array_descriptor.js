(function(){
    "use strict";

    var utils = require( '../utils' );
    var VertexArray = require( './vertex_array' );

    /**
     * @class Picimo.core.VertexArrayDescriptor
     * @param {Object} descriptor - The description
     * @example
     * var descriptor = new Picimo.core.VertexArrayDescriptor({
     *
     *     vertexCount         : 4,
     *     vertexAttrCount     : 12,
     *
     *     attrOffsetPosition  : 0,
     *     attrOffsetRotate    : 3,
     *     attrOffsetTexCoords : 4,
     *     attrOffsetTranslate : 6,
     *     attrOffsetScale     : 8,
     *     attrOffsetOpacity   : 9,
     *
     *     vertexAttribPointer : {
     *
     *         pos2d     : { type: 'V2v2v4v4'   },
     *         rotate    : { type: 'v2v1V1v4v4' },
     *         posZ      : { type: 'v2V1v1v4v4' },
     *
     *         uv        : { type: 'v4V2v2v4'   },
     *         translate : { type: 'v4v2V2v4'   },
     *         scale     : { type: 'v4v4V1v1v2' },
     *         opacity   : { type: 'v4v4v1V1v2' }
     *
     *     }
     * };
     *
     */
    function VertexArrayDescriptor ( descriptor ) {

        utils.object.definePropertiesPublicRO( descriptor );

        Object.freeze( this );

    }

    /**
     * @method Picimo.core.VertexArrayDescriptor#createVertexArray
     * @param {number} [size=1]
     * @return {Picimo.core.VertexArray}
     */
    VertexArrayDescriptor.prototype.createVertexArray = function ( size ) {

        return new VertexArray( this, ( size === undefined ? 1 : size ) );

    };

    module.exports = VertexArrayDescriptor;

})();
