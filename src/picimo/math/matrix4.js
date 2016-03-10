'use strict';

import * as utils from '../utils';

const { mat4 } = utils.glMatrix;
//const { publicRO } = utils.object.decorator;

export default class Matrix4 {

    serial = 1;

    //@publicRO
    //mat4 = mat4.create();

    constructor () {
        utils.object.definePropertyPublicRO(this, 'mat4', mat4.create());
        Object.seal(this);
    }

    identity () {
        mat4.identity(this.mat4);
        ++this.serial;
    }

    ortho (width, height, zRange) {

        let hw = width >> 1;
        let hh = height >> 1;
        let hz = ( zRange ? zRange : Math.pow(2, 14) ) >> 1;

        mat4.ortho( this.mat4, -hw, hw, -hh, hh, -hz, hz );
        ++this.serial;

    }

    translate (x, y, z=0) {
        mat4.translate(this.mat4, this.mat4, [x, y, z]);
        ++this.serial;
    }

    scale (x, y, z=1) {
        mat4.scale(this.mat4, this.mat4, [x, y, z]);
        ++this.serial;
    }

    rotateX (deg) {
        mat4.rotateX(this.mat4, this.mat4, deg * Math.PI / 180.0);
        ++this.serial;
    }

    rotateY (deg) {
        mat4.rotateY(this.mat4, this.mat4, deg * Math.PI / 180.0);
        ++this.serial;
    }

    rotateZ (deg) {
        mat4.rotateZ(this.mat4, this.mat4, deg * Math.PI / 180.0);
        ++this.serial;
    }

    multiply (a, b) {
        mat4.multiply(this.mat4, a.mat4, b.mat4);
        ++this.serial;
    }

    copy (src) {
        mat4.copy(this.mat4, src.mat4);
        ++this.serial;
    }

    clone () {
        let dolly = new Matrix4();
        dolly.copy(this);
        return dolly;
    }

    get x () {
        return this.mat4[12];
    }

    set x (val) {
        this.mat4[12] = val;
        ++this.serial;
    }

    get y () {
        return this.mat4[13];
    }

    set y (val) {
        this.mat4[13] = val;
        ++this.serial;
    }

    get z () {
        return this.mat4[14];
    }

    set z (val) {
        this.mat4[14] = val;
        ++this.serial;
    }

    get sx () {
        return this.mat4[0];
    }

    set sx (val) {
        this.mat4[0] = val;
        ++this.serial;
    }

    get sy () {
        return this.mat4[5];
    }

    set sy (val) {
        this.mat4[5] = val;
        ++this.serial;
    }

    get sz () {
        return this.mat4[10];
    }

    set sz (val) {
        this.mat4[10] = val;
        ++this.serial;
    }

}


