(function(){
    "use strict";

    var utils = require( '../utils' );
    var mat4 = utils.glMatrix.mat4;

    /**
     * @class Picimo.math.Matrix4
     * @summary
     *   Wrapper for glMatrix *mat4*
     *
     */

    function Matrix4 () {

        /**
         * @member {mat4} Picimo.math.Matrix4#mat4
         * @readonly
         */

        utils.object.definePropertyPublicRO( this, 'mat4', mat4.create() );

        Object.freeze( this );
    
    }


    /**
     * @method Picimo.math.Matrix4#identity
     */

    Matrix4.prototype.identity = function () {
   
        mat4.identity( this.mat4 );

    };


    /**
     * @method Picimo.math.Matrix4#ortho
     * @param {number} width
     * @param {number} height
     * @param {number} zRange
     */

    Matrix4.prototype.ortho = function ( width, height, zRange ) {
   
        var hw = width >> 1;
        var hh = height >> 1;
        var hz = ( zRange ? zRange : Math.pow(2,14) ) >> 1;

        mat4.ortho( this.mat4, -hw, hw, -hh, hh, -hz, hz );

    };


    module.exports = Matrix4;

})();
