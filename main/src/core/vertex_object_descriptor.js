import VertexArray from './vertex_array';
import VertexObject from './vertex_object';

/**
 * @param {function} vertexObjectConstructor - Vertex object constructor function
 * @param {number} vertexCount - Vertex count
 * @param {number} vertexAttrCount - Vertex attribute count
 * @param {Array} attributes - Vertex attribute descriptions
 * @param {Object} [aliases] - Vertex attribute aliases
 * @example
 * var descriptor = new Picimo.core.VertexObjectDescriptor(
 *
 *     null,
 *
 *     4,   // vertexCount
 *     12,  // vertexAttrCount
 *
 *     [    // attributes ..
 *
 *         { name: 'position',  size: 3, attrNames: [ 'x', 'y', 'z' ] },
 *         { name: 'rotate',    size: 1, uniform: true },
 *         { name: 'texCoords', size: 2, attrNames: [ 's', 't' ] },
 *         { name: 'translate', size: 2, attrNames: [ 'tx', 'ty' ], uniform: true },
 *         { name: 'scale',     size: 1, uniform: true },
 *         { name: 'opacity',   size: 1, uniform: true }
 *
 *     ],
 *
 *     {   // aliases ..
 *
 *         pos2d: { size: 2, offset: 0 },
 *         posZ:  { size: 1, offset: 2, uniform: true },
 *         uv:    'texCoords'
 *
 *     }
 *
 * );
 *
 * vo.proto.numberOfBeast = function () { return 666; };
 *
 *
 * var vo = descriptor.create();
 *
 * vo.setPosition( 1,2,-1, 4,5,-1, 7,8,-1, 10,11,-1 );
 * vo.x2                // => 7
 * vo.y0                // => 2
 * vo.posZ              // => -1
 * vo.posZ = 23;
 * vo.z1                // => 23
 * vo.numberOfBeast()   // => 666
 *
 */

export default function VertexObjectDescriptor ( vertexObjectConstructor, vertexCount, vertexAttrCount, attributes, aliases ) {

    this.vertexObjectConstructor = buildVOConstructor(vertexObjectConstructor);
    this.vertexObjectConstructor.prototype = Object.create( VertexObject.prototype );
    this.vertexObjectConstructor.prototype.constructor = this.vertexObjectConstructor;

    this.vertexCount = parseInt( vertexCount, 10 );
    this.vertexAttrCount = parseInt( vertexAttrCount, 10 );

    // ======= attributes =======

    this.attr = {};

    var offset, attr, i;

    if ( Array.isArray( attributes ) ) {

        offset = 0;

        for ( i = 0; i < attributes.length; ++i ) {

            attr = attributes[ i ];

            if ( attr.size === undefined ) throw new Error( 'vertex object attribute descriptor has no size property!' );

            if ( attr.name !== undefined ) {

                this.attr[ attr.name ] = new VertexObjectAttrDescriptor( attr.name, attr.size, offset, !! attr.uniform, attr.attrNames );

            }

            offset += attr.size;

        }

        if ( offset > this.vertexAttrCount ) throw new Error( 'vertexAttrCount is too small (offset=' + offset + ')' );

    }

    // ======= aliases =======

    var name;

    if ( aliases !== undefined ) {

        for ( name in aliases ) {

            if ( aliases.hasOwnProperty( name ) ) {

                attr = aliases[ name ];

                if ( typeof attr === 'string' ) {

                    attr = this.attr[ attr ];

                    if ( attr !== undefined ) {

                        this.attr[ name ] = attr;

                    }

                } else {

                    this.attr[ name ] = new VertexObjectAttrDescriptor( name, attr.size, attr.offset, !! attr.uniform, attr.attrNames );

                }

            }

        }

    }

    // ======= propertiesObject =======

    this.propertiesObject = {};

    for ( name in this.attr ) {

        if ( this.attr.hasOwnProperty( name ) ) {

            attr = this.attr[ name ];

            attr.defineProperties( name, this.propertiesObject, this );

        }

    }


    // ======= vertex object prototype =======

    this.vertexObjectPrototype = Object.create( this.vertexObjectConstructor.prototype, this.propertiesObject );


    // === winterkälte jetzt

    Object.freeze( this.attr );
    Object.freeze( this );

}

/**
 * @ignore
 */
function buildVOConstructor ( constructorFunc ) {
    if (typeof constructorFunc === 'function') {
        if (!constructorFunc.name) {
            return function CustomVertexObject () {
                return constructorFunc.call(this);
            };
        } else {
            return constructorFunc;
        }
    } else {
        return function CustomVertexObject () {};
    }
}


/**
 * @param {number} [size=1]
 * @return {VertexArray}
 */
VertexObjectDescriptor.prototype.createVertexArray = function ( size ) {

    return new VertexArray( this, ( size === undefined ? 1 : size ) );

};

/**
 * Create a new {@link VertexObject}.
 * @param {VertexArray} [vertexArray] - Vertex array
 * @return {VertexObject}
 */
VertexObjectDescriptor.prototype.create = function ( vertexArray ) {

    var vo = Object.create( this.vertexObjectPrototype );
    VertexObject.call( vo, this, vertexArray );

    if ( VertexObject !== this.vertexObjectConstructor ) {

        this.vertexObjectConstructor.call( vo );

    }

    return vo;

};


/**
 * @param {string} name
 * @param {number} [size=1]
 * @return {boolean}
 */
VertexObjectDescriptor.prototype.hasAttribute = function ( name, size ) {

    var attr = this.attr[ name ];
    return attr && attr.size === ( size || 1 );

};


Object.defineProperties( VertexObjectDescriptor.prototype, {

    /**
     * The prototype object of the vertex object. You should add your own properties and methods here.
     */
    'proto': {
        get: function () {

            return this.vertexObjectConstructor.prototype;

        },
        enumerable: true
    }

});


// =========================================
// VertexObjectAttrDescriptor
// =========================================

/**
 * @ignore
 */
function VertexObjectAttrDescriptor ( name, size, offset, uniform, attrNames ) {

    this.name      = name;
    this.size      = size;
    this.offset    = offset;
    this.uniform   = uniform;
    this.attrNames = attrNames;

    Object.freeze( this );

}

/**
 * @ignore
 */
VertexObjectAttrDescriptor.prototype.getAttrPostfix = function ( name, index ) {

    if ( this.attrNames ) {

        var postfix = this.attrNames[ index ];

        if ( postfix !== undefined ) {

            return postfix;

        }

    }

    return name + '_' + index;

};

/**
 * @ignore
 */
VertexObjectAttrDescriptor.prototype.defineProperties = function ( name, obj, descriptor ) {

    var i, j;

    if ( this.size === 1 ) {

        if ( this.uniform ) {

            obj[ name ] = {

                get        : get_v1f_u( this.offset ),
                set        : set_v1f_u( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                enumerable : true

            };

        } else {

            obj[ "set" + camelize( name ) ] = {

                value      : set_vNf_v( 1, descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                enumerable : true

            };

            for ( i = 0; i < descriptor.vertexCount ; ++i ) {

                obj[ name + i ] = {

                    get        : get_v1f_u( this.offset + ( i * descriptor.vertexAttrCount ) ),
                    set        : set_vNf_v( 1, 1, 0, this.offset + ( i * descriptor.vertexAttrCount ) ),
                    enumerable : true

                };

            }

        }

    } else if ( this.size >= 2 ) {

        if ( this.uniform ) {

            obj[ "get" + camelize( name ) ] = {

                value      : get_vNf_u( this.offset ),
                enumerable : true

            };

            obj[ "set" + camelize( name ) ] = {

                value      : set_vNf_u( this.size, descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                enumerable : true

            };

            for ( i = 0; i < this.size ; ++i ) {

                obj[ this.getAttrPostfix( name, i ) ] = {

                    get        : get_v1f_u( this.offset + i ),
                    set        : set_v1f_u( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset + i ),
                    enumerable : true

                };

            }

        } else {

            obj[ "set" + camelize( name ) ] = {

                value      : set_vNf_v( this.size, descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                enumerable : true

            };

            for ( i = 0; i < descriptor.vertexCount ; ++i ) {
                for ( j = 0; j < this.size ; ++j ) {

                    obj[ this.getAttrPostfix( name, j ) + i ] = {

                        get        : get_v1f_u( this.offset + ( i * descriptor.vertexAttrCount ) + j ),
                        set        : set_vNf_v( 1, 1, 0, this.offset + ( i * descriptor.vertexAttrCount ) + j ),
                        enumerable : true

                    };

                }
            }

        }

    }

};

/**
 * @ignore
 */
function get_vNf_u ( offset ) {

    return function ( attrIndex ) {

        return this.vertexArray.vertices[ offset + attrIndex ];

    };

}

/**
 * @ignore
 */
function set_vNf_u ( vectorLength, vertexCount, vertexAttrCount, offset ) {
    return function () {

        let _vertices = this.vertexArray.vertices;
        let i;
        let n;

        for ( i = 0; i < vertexCount; ++i ) {
            for ( n = 0; n < vectorLength; ++n ) {
                _vertices[ ( i * vertexAttrCount ) + offset + n ] = arguments[n];
            }
        }

    };
}

/**
 * @ignore
 */
function get_v1f_u ( offset ) {
    return function () {
        return this.vertexArray.vertices[ offset ];
    };
}

/**
 * @ignore
 */
function set_vNf_v ( vectorLength, vertexCount, vertexAttrCount, offset ) {
    return function () {

        let _vertices = this.vertexArray.vertices;
        let i;
        let n;

        for ( i = 0; i < vertexCount; ++i ) {
            for ( n = 0; n < vectorLength; ++n ) {
                _vertices[( i * vertexAttrCount ) + offset + n] = arguments[( i * vectorLength ) + n];
            }
        }

    };
}

/**
 * @ignore
 */
function set_v1f_u ( vertexCount, vertexAttrCount, offset ) {
    return function ( value ) {

        var _vertices = this.vertexArray.vertices;

        for ( let i = 0; i < vertexCount; ++i ) {

            _vertices[ ( i * vertexAttrCount ) + offset ] = value;

        }

    };
}

/**
 * @ignore
 */
function camelize ( name ) {
    return name[ 0 ].toUpperCase() + name.substr( 1 );
}

