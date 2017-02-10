
/**
 * Define a *read-only* property which is *enumerable* but not *writable* and *configurable*.
 *
 * @name utils.definePropertyPublicRO
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @param {Object} obj
 * @param {string} name
 * @param {*} value
 * @return {Object} obj
 */
export function definePropertyPublicRO ( obj, name, value ) {

    Object.defineProperty( obj, name, {
        value        : value,
        configurable : true,
        enumerable   : true
    });

    return obj;

}


/**
 * Define a property which is NOT *enumerable* and *configurable* BUT *writable*.
 *
 * @name utils.definePropertyPrivate
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @param {Object} obj
 * @param {string} name
 * @param {*} value
 * @return {Object} obj
 */
export function definePropertyPrivate ( obj, name, value ) {

    Object.defineProperty( obj, name, {
        value    : value,
        writable : true
    });

    return obj;

}


/**
 * Define a **read-only** property which is NOT *enumerable*, *configurable* and *writable*.
 *
 * @name utils.definePropertyPrivateRO
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * @param {Object} obj
 * @param {string} name
 * @param {*} value
 * @return {Object} obj
 */
export function definePropertyPrivateRO ( obj, name, value ) {

    Object.defineProperty( obj, name, {
        value : value
    });

    return obj;

}


/**
 * Define *read-only* properties which are *enumerable* but not *writable* and *configurable*.
 *
 * @name utils.definePropertiesPublicRO
 * @example
 * Picimo.utils.object.definePropertiesPublicRO( obj, {
 *     FOO: 'foo',
 *     BAR: 'plah!'
 * });
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
 *
 * @param {Object} obj
 * @param {Object} map - the name/value map
 *
 * @return {Object} obj
 */
export function definePropertiesPublicRO ( obj, map ) {

    for ( var key in map ) {

        if ( Object.hasOwnProperty.call( map, key ) ) {

            Object.defineProperty( obj, key, {
                value        : map[ key ],
                configurable : true,
                enumerable   : true
            });

        }

    }

    return obj;

}

/**
 * Define *read-only* properties which are NOT *enumerable*, *writable* or *configurable*.
 *
 * @name utils.definePropertiesPrivateRO
 * @example
 * Picimo.utils.object.definePropertiesPrivateRO( obj, {
 *     _FOO: 'foo',
 *     _bar: 'plah!'
 * });
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
 *
 * @param {Object} obj
 * @param {Object} map - the name/value map
 *
 * @return {Object} obj
 */
export function definePropertiesPrivateRO ( obj, map ) {

    for ( var key in map ) {

        if ( Object.hasOwnProperty.call( map, key ) ) {

            Object.defineProperty( obj, key, { value: map[ key ] });

        }

    }

    return obj;

}

