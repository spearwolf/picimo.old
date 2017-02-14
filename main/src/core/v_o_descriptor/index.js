/* jshint esversion:6 */
import { BYTES_PER_ELEMENT } from '../../utils/typed_array_helpers';
import { createVO } from '../v_o_helper';
import VOArray from '../v_o_array';
import VOAttrDescriptor from '../v_o_attr_descriptor';
import createVOPrototype from './create_v_o_prototype';
import createTypedArrays from './create_typed_arrays';
import createAttributes from './create_attributes';
import createAliases from './create_aliases';

/**
 * Vertex object descriptor.
 *
 * @class VODescriptor
 *
 * @param {Object} options
 * @param {number} options.vertexCount - number of vertices
 * @param {Object[]} options.attributes - list of vertex attribute descriptions (see example)
 * @param {Object} [options.aliases] - *optional* list of attribute aliases
 * @param {Object} [options.proto]
 *
 * @example
 * const descriptor = new VODescriptor({
 *
 *     proto: {
 *         foo() {
 *             return this.voArray.float32Array[0];
 *         }
 *     },
 *
 *     // vertex buffer layout
 *     // --------------------
 *     //
 *     // v0: (x0)(y0)(z0)(rotate](s0)(t0)(tx)(ty)(scale)(opacity)
 *     // v1: (x1)(y1)(z1)(rotate](s1)(t1)(tx)(ty)(scale)(opacity)
 *     // v2: (x2)(y2)(z2)(rotate](s2)(t2)(tx)(ty)(scale)(opacity)
 *     // v3: (x3)(y3)(z3)(rotate](s3)(t3)(tx)(ty)(scale)(opacity)
 *     //
 *     vertexCount: 4,
 *
 *     attributes: [
 *
 *         { name: 'position',  type: 'float32', size: 3, attrNames: [ 'x', 'y', 'z' ] },
 *         { name: 'rotate',    type: 'float32', size: 1, uniform: true },
 *         { name: 'texCoords', type: 'float32', size: 2, attrNames: [ 's', 't' ] },
 *         { name: 'translate', type: 'float32', size: 2, attrNames: [ 'tx', 'ty' ], uniform: true },
 *         { name: 'scale',     type: 'float32', size: 1, uniform: true },
 *         { name: 'opacity',   type: 'float32', size: 1, uniform: true }
 *
 *     ],
 *
 *     aliases: {
 *
 *         pos2d: { size: 2, type: 'float32', offset: 0 },
 *         posZ:  { size: 1, type: 'float32', offset: 2, uniform: true },
 *         r:     { size: 1, type: 'float32', offset: 3 },
 *         uv:    'texCoords',
 *
 *     }
 *
 * });
 *
 */

export default class VODescriptor {

    constructor ({ vertexCount, attributes, aliases, proto }) {

        this.vertexCount = parseInt( vertexCount, 10 );

        createAttributes(this, attributes);
        createAliases(this, aliases);
        createVOPrototype(this, proto);
        createTypedArrays(this);

        // === winterkälte jetzt

        Object.keys( this.attr ).forEach( name => Object.freeze( this.attr[name] ) );
        Object.freeze( this.attr );
        Object.freeze( this );

    }

    /**
     * @param {number} [size=1]
     * @returns {VOArray}
     */
    createVOArray ( size = 1 ) {

        return new VOArray( this, size );

    }

    /**
     * Create a new *vertex object*
     *
     * @param {VOArray} [voArray]
     * @returns {Object} the *vertex object*
     */
    createVO ( voArray ) {

        return createVO(Object.create( this.voPrototype ), this, voArray);

    }

    /**
     * @param {string} name
     * @param {number} size - attribute item count
     * @returns {boolean}
     */
    hasAttribute ( name, size ) {

        const attr = this.attr[ name ];
        return attr && attr.size === size;

    }

    /**
     * Max number of vertex objects when a vertex buffer is used together
     * with a indexed element array to draw primitives. the reason for
     * such a limit is that webgl restricts element array indices
     * to an uin16 data type.
     * @type {number}
     */

    get maxIndexedVOPoolSize () {

        return Math.floor( 65536 / this.vertexCount );

    }

}

