'use strict';

import utils from '../utils';

var {mat4} = utils.glMatrix;
var {publicRO} = utils.object.decorator;


/**
 * @class Picimo.math.Matrix4
 */

export default class Matrix4 {

    serial = 1;

    /**
     * @member {mat4} Picimo.math.Matrix4#mat4
     * @readonly
     */

    @publicRO
    mat4 = mat4.create();

    constructor () {
        Object.seal(this);
    }

    /**
     * @method Picimo.math.Matrix4#identity
     */

    identity () {
        mat4.identity(this.mat4);
        ++this.serial;
    }


    /**
     * @method Picimo.math.Matrix4#ortho
     * @param {number} width
     * @param {number} height
     * @param {number} zRange
     */

    ortho ( width, height, zRange ) {

        let hw = width >> 1;
        let hh = height >> 1;
        let hz = ( zRange ? zRange : Math.pow(2, 14) ) >> 1;

        mat4.ortho( this.mat4, -hw, hw, -hh, hh, -hz, hz );
        ++this.serial;

    }

}

