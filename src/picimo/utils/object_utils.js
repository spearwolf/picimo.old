'use strict';

import * as decorator from './object_decorator';
export { decorator };

/**
 * @function Picimo.utils.object.definePropertyPublicRO
 * @description
 *   Define a *read-only* property which is *enumerable* but not *writable* and *configurable*.
 * @param {Object} obj
 * @param {string} name
 * @param value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @return obj
 */
export function definePropertyPublicRO ( obj, name, value ) {

    Object.defineProperty( obj, name, {
        value     : value,
        enumerable: true
    });

    return obj;

}


/**
 * @function Picimo.utils.object.definePropertyPrivate
 * @description
 *   Define a property which is NOT *enumerable* and *configurable* BUT *writable*.
 * @param {Object} obj
 * @param {string} name
 * @param value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @return obj
 */
export function definePropertyPrivate ( obj, name, value ) {

    Object.defineProperty( obj, name, {
        value    : value,
        writable : true
    });

    return obj;

}


/**
 * @function Picimo.utils.object.definePropertyPrivateRO
 * @description
 *   Define a **read-only** property which is NOT *enumerable*, *configurable* and *writable*.
 * @param {Object} obj
 * @param {string} name
 * @param value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @return obj
 */
export function definePropertyPrivateRO ( obj, name, value ) {

    Object.defineProperty( obj, name, {
        value : value
    });

    return obj;

}


/**
 * @function Picimo.utils.object.definePropertiesPublicRO
 *
 * @description
 * Define *read-only* properties which are *enumerable* but not *writable* and *configurable*.
 *
 * @param {Object} obj
 * @param {Object} The name/value map
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
 *
 * @example
 * Picimo.utils.object.definePropertiesPublicRO( obj, {
 *     FOO: 'foo',
 *     BAR: 'plah!'
 * });
 *
 * @return obj
 */
export function definePropertiesPublicRO ( obj, map ) {

    for ( var key in map ) {

        if ( Object.hasOwnProperty.call( map, key ) ) {

            Object.defineProperty( obj, key, {
                value     : map[ key ],
                enumerable: true
            });

        }

    }

    return obj;

}


/**
 * @function Picimo.utils.object.definePropertiesPrivateRO
 *
 * @description
 * Define *read-only* properties which are NOT *enumerable*, *writable* or *configurable*.
 *
 * @param {Object} obj
 * @param {Object} The name/value map
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
 *
 * @example
 * Picimo.utils.object.definePropertiesPrivateRO( obj, {
 *     _FOO: 'foo',
 *     _bar: 'plah!'
 * });
 *
 * @return obj
 */
export function definePropertiesPrivateRO ( obj, map ) {

    for ( var key in map ) {

        if ( Object.hasOwnProperty.call( map, key ) ) {

            Object.defineProperty( obj, key, { value: map[ key ] });

        }

    }

    return obj;

}

