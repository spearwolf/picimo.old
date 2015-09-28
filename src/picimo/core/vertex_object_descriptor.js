(function () {
    "use strict";

    //var utils = require( '../utils' );
    var VertexObject = require( './vertex_object' );
    var VertexArray = require( './vertex_array' );

    /**
     * @class Picimo.core.VertexObjectDescriptor
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
    function VertexObjectDescriptor ( vertexObjectConstructor, vertexCount, vertexAttrCount, attributes, aliases ) {

        this.vertexObjectConstructor = typeof vertexObjectConstructor === 'function' ? vertexObjectConstructor : ( function () {} );
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
     * @method Picimo.core.VertexObjectDescriptor#createVertexArray
     * @param {number} [size=1]
     * @return {Picimo.core.VertexArray}
     */
    VertexObjectDescriptor.prototype.createVertexArray = function ( size ) {

        return new VertexArray( this, ( size === undefined ? 1 : size ) );

    };

    /**
     * Create a new vertex object.
     * @method Picimo.core.VertexObjectDescriptor#create
     * @param {Picimo.core.VertexArray} [vertexArray] - Vertex array.
     * @return {Picimo.core.VertexObject}
     */
    VertexObjectDescriptor.prototype.create = function ( vertexArray ) {

        var vo = Object.create( this.vertexObjectPrototype );
        VertexObject.call( vo, this, vertexArray );

        if ( VertexObject !== this.vertexObjectConstructor ) {

            this.vertexObjectConstructor.call( vo );

        }

        return vo;

    };

    VertexObjectDescriptor.prototype.hasAttribute = function ( name, size ) {

        var attr = this.attr[ name ];
        return attr && attr.size === ( size || 1 );

    };


    Object.defineProperties( VertexObjectDescriptor.prototype, {

        /**
         * @member {Object} Picimo.core.VertexObjectDescriptor#proto - The prototype object of the vertex object. You should add your own properties and methods here.
         * @readonly
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

    function VertexObjectAttrDescriptor ( name, size, offset, uniform, attrNames ) {

        this.name      = name;
        this.size      = size;
        this.offset    = offset;
        this.uniform   = uniform;
        this.attrNames = attrNames;

        Object.freeze( this );

    }

    VertexObjectAttrDescriptor.prototype.getAttrPostfix = function ( name, index ) {

        if ( this.attrNames ) {

            var postfix = this.attrNames[ index ];

            if ( postfix !== undefined ) {

                return postfix;

            }

        }

        return name + '_' + index;

    };

    VertexObjectAttrDescriptor.prototype.defineProperties = function ( name, obj, descriptor ) {

        var i, j, setter;

        if ( this.size === 1 ) {

            if ( this.uniform ) {

                obj[ name ] = {

                    get        : get_v1f_u( this.offset ),
                    set        : set_v1f_u( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                    enumerable : true

                };

            } else {

                obj[ "set" + camelize( name ) ] = {

                    value      : set_v1f_v( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                    enumerable : true

                };

                for ( i = 0; i < descriptor.vertexCount ; ++i ) {

                    obj[ name + i ] = {

                        get        : get_v1f_u( this.offset + ( i * descriptor.vertexAttrCount ) ),
                        set        : set_v1f_v( 1, 0, this.offset + ( i * descriptor.vertexAttrCount ) ),
                        enumerable : true

                    };

                }

            }

        } else if ( this.size >= 2 && this.size <= 4 ) {

            if ( this.uniform ) {

                obj[ "get" + camelize( name ) ] = {

                    value      : get_vNf_u( this.offset ),
                    enumerable : true

                };

                setter = [ set_v2f_u, set_v3f_u, set_v4f_u ][ this.size - 2 ];

                obj[ "set" + camelize( name ) ] = {

                    value      : setter( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
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

                setter = [ set_v2f_v, set_v3f_v ][ this.size - 2 ];

                obj[ "set" + camelize( name ) ] = {

                    value      : setter( descriptor.vertexCount, descriptor.vertexAttrCount, this.offset ),
                    enumerable : true

                };

                for ( i = 0; i < descriptor.vertexCount ; ++i ) {
                    for ( j = 0; j < this.size ; ++j ) {

                        obj[ this.getAttrPostfix( name, j ) + i ] = {

                            get        : get_v1f_u( this.offset + ( i * descriptor.vertexAttrCount ) + j ),
                            set        : set_v1f_v( 1, 0, this.offset + ( i * descriptor.vertexAttrCount ) + j ),
                            enumerable : true

                        };

                    }
                }

            }

        } else {

            throw new Error( 'Unsupprted vertex attribute size of ' + this.size + ' (should not be greater than 4)' );

        }

    };

    function get_vNf_u ( offset ) {

        return function ( attrIndex ) {

            return this.vertexArray.vertices[ offset + attrIndex ];

        };

    }

    function set_v2f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( v0, v1 ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset     ] = v0;
                _vertices[ ( i * vertexAttrCount ) + offset + 1 ] = v1;

            }

        };

    }

    function set_v3f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( v0, v1, v2 ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset     ] = v0;
                _vertices[ ( i * vertexAttrCount ) + offset + 1 ] = v1;
                _vertices[ ( i * vertexAttrCount ) + offset + 2 ] = v2;

            }

        };

    }

    function set_v4f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( v0, v1, v2, v3 ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset     ] = v0;
                _vertices[ ( i * vertexAttrCount ) + offset + 1 ] = v1;
                _vertices[ ( i * vertexAttrCount ) + offset + 2 ] = v2;
                _vertices[ ( i * vertexAttrCount ) + offset + 3 ] = v3;

            }

        };

    }

    function get_v1f_u ( offset ) {

        return function () {

            return this.vertexArray.vertices[ offset ];

        };

    }

    function set_v1f_v ( vertexCount, vertexAttrCount, offset ) {

        if ( vertexCount === 1 ) {

            return function ( value ) {

                this.vertexArray.vertices[ offset ] = value;

            };

        } else if ( vertexCount === 3 ) {

            return function ( v0, v1, v2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                           = v0;
                _vertices[ vertexAttrCount + offset ]         = v1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ] = v2;

            };

        } else if ( vertexCount === 4 ) {

            return function ( v0, v1, v2, v3 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                           = v0;
                _vertices[ vertexAttrCount + offset ]         = v1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ] = v2;
                _vertices[ ( 3 * vertexAttrCount ) + offset ] = v3;

            };

        } else {

            throw new Error( 'Unsupported vertexCount=' + vertexCount + ' for per vertex attribute (allowed is 1, 3 or 4)' );

        }

    }

    function set_v2f_v ( vertexCount, vertexAttrCount, offset ) {

        if ( vertexCount === 1 ) {

            return function ( value_0, value_1 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]     = value_0;
                _vertices[ offset + 1 ] = value_1;

            };

        } else if ( vertexCount === 3 ) {

            return function ( v0, v1, v0_1, v1_1, v0_2, v1_2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;

            };

        } else if ( vertexCount === 4 ) {

            return function ( v0, v1, v0_1, v1_1, v0_2, v1_2, v0_3, v1_3 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;
                _vertices[ ( 3 * vertexAttrCount ) + offset ]     = v0_3;
                _vertices[ ( 3 * vertexAttrCount ) + offset + 1 ] = v1_3;

            };

        } else {

            throw new Error( 'Unsupported vertexCount=' + vertexCount + ' for per vertex attribute (allowed is 1, 3 or 4)' );

        }

    }

    function set_v3f_v ( vertexCount, vertexAttrCount, offset ) {

        if ( vertexCount === 1 ) {

            return function ( value_0, value_1, value_2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]     = value_0;
                _vertices[ offset + 1 ] = value_1;
                _vertices[ offset + 2 ] = value_2;

            };

        } else if ( vertexCount === 3 ) {

            return function ( v0, v1, v2, v0_1, v1_1, v2_1, v0_2, v1_2, v2_2 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ offset + 2 ]                           = v2;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ vertexAttrCount + offset + 2 ]         = v2_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 2 ] = v2_2;

            };

        } else if ( vertexCount === 4 ) {

            return function ( v0, v1, v2, v0_1, v1_1, v2_1, v0_2, v1_2, v2_2, v0_3, v1_3, v2_3 ) {

                var _vertices = this.vertexArray.vertices;

                _vertices[ offset ]                               = v0;
                _vertices[ offset + 1 ]                           = v1;
                _vertices[ offset + 2 ]                           = v2;
                _vertices[ vertexAttrCount + offset ]             = v0_1;
                _vertices[ vertexAttrCount + offset + 1 ]         = v1_1;
                _vertices[ vertexAttrCount + offset + 2 ]         = v2_1;
                _vertices[ ( 2 * vertexAttrCount ) + offset ]     = v0_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 1 ] = v1_2;
                _vertices[ ( 2 * vertexAttrCount ) + offset + 2 ] = v2_2;
                _vertices[ ( 3 * vertexAttrCount ) + offset ]     = v0_3;
                _vertices[ ( 3 * vertexAttrCount ) + offset + 1 ] = v1_3;
                _vertices[ ( 3 * vertexAttrCount ) + offset + 2 ] = v2_3;

            };

        } else {

            throw new Error( 'Unsupported vertexCount=' + vertexCount + ' for per vertex attribute (allowed is 1, 3 or 4)' );

        }

    }

    function set_v1f_u ( vertexCount, vertexAttrCount, offset ) {

        return function ( value ) {

            var _vertices = this.vertexArray.vertices;

            for ( var i = 0; i < vertexCount; ++i ) {

                _vertices[ ( i * vertexAttrCount ) + offset ] = value;

            }

        };

    }


    function camelize ( name ) {

        return name[ 0 ].toUpperCase() + name.substr( 1 );

    }

    module.exports = VertexObjectDescriptor;

})();
