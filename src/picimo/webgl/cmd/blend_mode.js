(function(){
    "use strict";

    /**
     * @class Picimo.webgl.cmd.BlendMode
     * @classdesc
     *   WebGL blend and depth mode state description.
     *
     * @param {boolean} depthTest - Enable or disable depth test.
     * @param {boolean} [depthMask] - Enable or disable depth buffer writes.
     * @param {string} [depthFunc] - Set the depth function.
     * @param {boolean} blend - Enable or disable blending.
     * @param {string} [blendFuncSrc] - Set the source blend function.
     * @param {string} [blendFuncDst] - Set the destination blend function.
     *
     * @example
     * // default settings
     * new Picimo.webgl.cmd.BlendMode( true, true, 'LEQUAL', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' )
     *
     * @example
     * // disable both
     * new Picimo.webgl.cmd.BlendMode( false, false )
     *
     */

    function BlendMode ( depthTest, depthMask, depthFunc, blend, blendFuncSrc, blendFuncDst ) {

        this.depthTest = !! depthTest;

        if ( this.depthTest ) {
        
            this.depthMask = depthMask;
            this.depthFunc = depthFunc;
        
        } else {
        
            blend        = depthMask;
            blendFuncSrc = depthFunc;
            blendFuncDst = blend;
        
        }
    
        this.blend = !! blend;

        if ( this.blend ) {
        
            this.blendFuncSrc = blendFuncSrc;
            this.blendFuncDst = blendFuncDst;
        
        }

        Object.freeze( this );

    }

    /**
     * @member {boolean} Picimo.webgl.cmd.BlendMode#depthTest
     */

    /**
     * @member {boolean} Picimo.webgl.cmd.BlendMode#depthMask
     */

    /**
     * @member {string} Picimo.webgl.cmd.BlendMode#depthFunc
     */

    /**
     * @member {boolean} Picimo.webgl.cmd.BlendMode#blend
     */

    /**
     * @member {string} Picimo.webgl.cmd.BlendMode#blendFuncSrc
     */

    /**
     * @member {string} Picimo.webgl.cmd.BlendMode#blendFuncDst
     */

    /**
     * @method Picimo.webgl.cmd.BlendMode#activate
     * @param {WebGlRenderingContext} gl - gl
     */

    BlendMode.prototype.activate = function ( gl ) {
    
        if ( this.depthTest ) {
        
            gl.enable( gl.DEPTH_TEST );
            gl.depthMask( this.depthMask );
            gl.depthFunc( gl[ this.depthFunc ] );

        } else {
        
            gl.disable( gl.DEPTH_TEST );

        }
    
        if ( this.blend ) {
        
            gl.enable( gl.BLEND );
            gl.blendFunc( gl[ this.blendFuncSrc ], gl[ this.blendFuncDst ] );

        } else {
        
            gl.disable( gl.BLEND );

        }
    
    };


/*
        // good default settings
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);       // enable writing into the depth buffer
        //gl.depthFunc(gl.ALWAYS);  // sprites blending
        gl.depthFunc(gl.LEQUAL);  // iso3d

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // good default
*/



    /**
     * @memberof Picimo.webgl.cmd.BlendMode
     * @constant DEFAULT
     * @static
     */

    BlendMode.DEFAULT = new BlendMode( true, true, 'ALWAYS', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' );

    /**
     * @memberof Picimo.webgl.cmd.BlendMode
     * @constant ISO3D
     * @static
     */

    BlendMode.ISO3D = new BlendMode( true, true, 'LEQUAL', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' );


    module.exports = BlendMode;

})();
