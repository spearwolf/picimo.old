/* jshint esversion:6 */
import { BYTES_PER_ELEMENT, TYPED_ARRAY_GETTER } from '../utils/typed_array_helpers';

export default class VOAttrDescriptor {

    constructor ( name, type, size, offset, byteOffset, uniform, attrNames ) {

        this.name = name;
        this.type = type;
        this.size = size;
        this.uniform = uniform;
        this.attrNames = attrNames;

        this.bytesPerElement = BYTES_PER_ELEMENT[ this.type ];
        this.bytesPerVertex = this.bytesPerElement * size;

        if (typeof byteOffset !== 'number') {
            this.byteOffset = offset * this.bytesPerElement;
        } else {
            this.byteOffset = byteOffset;
        }

        if (typeof offset !== 'number') {
            this.offset = byteOffset / this.bytesPerElement;
        } else {
            this.offset = offset;
        }

    }

    vertexAttrCount (descriptor) {
        return descriptor.bytesPerVertex / this.bytesPerElement;
    }

    /**
     * @private
     */
    static defineProperties ( attrDesc, propertiesObject, descriptor ) {

        const { name } = attrDesc;
        const getArray = TYPED_ARRAY_GETTER[attrDesc.type];
        const vertexCount = descriptor.vertexCount;
        const vertexAttrCount = attrDesc.vertexAttrCount(descriptor);
        const offset = attrDesc.byteOffset / attrDesc.bytesPerElement;

        let i, j;

        if ( attrDesc.size === 1 ) {

            if ( attrDesc.uniform ) {

                const valueGetter = get_v1f_u( getArray, offset );

                attrDesc.getValue = function (vo) {
                    return valueGetter.call(vo);
                };

                propertiesObject[ name ] = {

                    get        : valueGetter,
                    set        : set_v1f_u( getArray, vertexCount, vertexAttrCount, offset ),
                    enumerable : true

                };

            } else {

                propertiesObject[ "set" + camelize( name ) ] = {

                    value      : set_vNf_v( getArray, 1, vertexCount, vertexAttrCount, offset ),
                    enumerable : true

                };

                const valueGetters = [];

                for ( i = 0; i < descriptor.vertexCount ; ++i ) {

                    const curValueGetter = get_v1f_u( getArray, offset + ( i * vertexAttrCount ) );

                    valueGetters.push(curValueGetter);

                    propertiesObject[ name + i ] = {

                        get        : curValueGetter,
                        set        : set_vNf_v( getArray, 1, 1, 0, offset + ( i * vertexAttrCount ) ),
                        enumerable : true

                    };

                }

                attrDesc.getValue = function (vo, vi) {
                    return valueGetters[vi].call(vo);
                };

            }

        } else if ( attrDesc.size >= 2 ) {

            if ( attrDesc.uniform ) {

                const valueGetter = get_vNf_u( getArray, offset );

                attrDesc.getValue = function (vo, vi, i) {
                    return valueGetter.call(vo, i);
                };

                propertiesObject[ "get" + camelize( name ) ] = {

                    value      : valueGetter,
                    enumerable : true

                };

                propertiesObject[ "set" + camelize( name ) ] = {

                    value      : set_vNf_u( getArray, attrDesc.size, vertexCount, vertexAttrCount, offset ),
                    enumerable : true

                };

                for ( i = 0; i < attrDesc.size ; ++i ) {

                    const setterName = getAttrPostfix( attrDesc, name, i );

                    propertiesObject[ setterName ] = {

                        get        : get_v1f_u( getArray, offset + i ),
                        set        : set_v1f_u( getArray, vertexCount, vertexAttrCount, offset + i ),
                        enumerable : true

                    };

                }

            } else {

                propertiesObject[ "set" + camelize( name ) ] = {

                    value      : set_vNf_v( getArray, attrDesc.size, vertexCount, vertexAttrCount, offset ),
                    enumerable : true

                };

                const valueGetters = [];

                for ( i = 0; i < descriptor.vertexCount ; ++i ) {

                    const curVertexValueGetters = [];

                    for ( j = 0; j < attrDesc.size ; ++j ) {

                        const setterName = getAttrPostfix( attrDesc, name, j ) + i;
                        const curValueGetter = get_v1f_u( getArray, offset + ( i * vertexAttrCount ) + j );

                        curVertexValueGetters.push(curValueGetter);

                        propertiesObject[ setterName ] = {

                            get        : curValueGetter,
                            set        : set_vNf_v( getArray, 1, 1, 0, offset + ( i * vertexAttrCount ) + j ),
                            enumerable : true

                        };

                    }

                    valueGetters.push(curVertexValueGetters);

                }

                attrDesc.getValue = function (vo, vi, i) {
                    return valueGetters[vi][i].call(vo);
                };

            }

        }

    }

}


function getAttrPostfix ( attrDesc, name, index ) {

    if ( attrDesc.attrNames ) {

        let postfix = attrDesc.attrNames[ index ];

        if ( postfix !== undefined ) {

            return postfix;

        }

    }

    return name + '_' + index;

}

function get_vNf_u ( getArray, offset ) {
    return function ( attrIndex ) {

        return getArray(this.voArray)[ offset + attrIndex ];

    };
}

function set_vNf_u ( getArray, vectorLength, vertexCount, vertexAttrCount, offset ) {
    return function () {

        const _array = getArray(this.voArray);
        let i;
        let n;

        for ( i = 0; i < vertexCount; ++i ) {
            for ( n = 0; n < vectorLength; ++n ) {
                _array[ ( i * vertexAttrCount ) + offset + n ] = arguments[n];
            }
        }

    };
}

function get_v1f_u ( getArray, offset ) {
    return function () {
        return getArray(this.voArray)[ offset ];
    };
}

function set_vNf_v ( getArray, vectorLength, vertexCount, vertexAttrCount, offset ) {
    return function () {

        const _array = getArray(this.voArray);
        let i;
        let n;

        for ( i = 0; i < vertexCount; ++i ) {
            for ( n = 0; n < vectorLength; ++n ) {
                _array[( i * vertexAttrCount ) + offset + n] = arguments[( i * vectorLength ) + n];
            }
        }

    };
}

function set_v1f_u ( getArray, vertexCount, vertexAttrCount, offset ) {
    return function ( value ) {

        const _array = getArray(this.voArray);

        for ( let i = 0; i < vertexCount; ++i ) {

            _array[ ( i * vertexAttrCount ) + offset ] = value;

        }

    };
}

function camelize ( name ) {
    return name[ 0 ].toUpperCase() + name.substr( 1 );
}

