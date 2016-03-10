'use strict';

import * as utils from '../utils';

const { mat4 } = utils.glMatrix;
//const { publicRO } = utils.object.decorator;


/**
 * @class Picimo.math.Matrix4
 */

export default class Matrix4 {

    serial = 1;

    /**
     * @member {mat4} Picimo.math.Matrix4#mat4
     * @readonly
     */

    //@publicRO
    //mat4 = mat4.create();

    constructor () {
        utils.object.definePropertyPublicRO(this, 'mat4', mat4.create());
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

    scale (x, y, z=1) {
        mat4.scale(this.mat4, this.mat4, [x, y, z]);
        ++this.serial;
    }

    multiply (a, b) {
        mat4.multiply(this.mat4, a.mat4, b.mat4);
        ++this.serial;
    }

    copy (from) {
        mat4.copy(this.mat4, from.mat4);
        ++this.serial;
    }

}

