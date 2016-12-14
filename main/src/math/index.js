import Matrix4 from './matrix4';
export { Matrix4 };

/**
 * @function Picimo.math.maxOf
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
export function maxOf ( a, b ) {

    return a > b ? a : b;

}

/**
 * @function Picimo.math.findNextPowerOfTwo
 * @param {number} x
 * @return {number}
 */
export function findNextPowerOfTwo ( x ) {

    var p = 1;

    while ( x > p ) {

        p <<= 1;

    }

    return p;

}

/**
 * @function Picimo.math.isPowerOfTwo
 * @param {number} n
 * @return {boolean}
 */
export function isPowerOfTwo ( n ) {

    return n !== 0 && ( n & ( n - 1 ) ) === 0;

}

