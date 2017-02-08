/* jshint esversion:6 */
/* jshint -W058 */

/**
 * WebGL blend and depth mode state description.
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
 * new Picimo.render.cmd.BlendMode( true, true, 'LEQUAL', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' )
 *
 * @example
 * // disable both
 * new Picimo.render.cmd.BlendMode( false, false )
 *
 */

const predefinedModes = new Map;

export default class BlendMode {

    constructor ( depthTest, depthMask, depthFunc, blend, blendFuncSrc, blendFuncDst ) {

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
     * @param {WebGlRenderingContext} gl
     */
    activate ( gl ) {

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

    }

    static get (name) {
        return predefinedModes.get(name);
    }

    static define (name, blendMode) {
        return predefinedModes.get(name);
    }

}

/*
    // good default settings
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);       // enable writing into the depth buffer
    //gl.depthFunc(gl.ALWAYS);  // sprites blending
    gl.depthFunc(gl.LEQUAL);  // iso3d

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // good default
*/

BlendMode.define('default', 
    new BlendMode( true, true, 'ALWAYS', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' ));

//BlendMode.define('iso3d', 
    //new BlendMode( true, true, 'LEQUAL', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' ));

