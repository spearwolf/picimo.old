'use strict';

import { Resource } from '../core';

/**
 * @class Picimo.render.ShaderSource
 * @extends Picimo.core.Resource
 * @param {Picimo.App} app
 * @param {string} shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
 * @param {string} name -
 * @param {string} [source]
 */

export default function ShaderSource ( app, shaderType, name, source ) {

    Resource.call( this, app, 'source' );

    /**
     * @member {string} Picimo.render.ShaderSource#shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
     */
    this.shaderType = shaderType;

    /**
     * @member {string} Picimo.render.ShaderSource#name
     */
    this.name = name;

    /**
     * @member {string} Picimo.render.ShaderSource#source - The shader source
     */
    this.source = source;

}

ShaderSource.prototype = Object.create( Resource.prototype );
ShaderSource.prototype.constructor = ShaderSource;


/**
 * @method Picimo.render.ShaderSource#compile
 * @param {WebGlRenderingContext} gl
 * @return {WebGLShader} - render shader object or *undefined*
 */

ShaderSource.prototype.compile = function ( gl ) {

    if ( ! this.ready ) return;

    var shader = gl.createShader( gl[ this.shaderType ] );

    gl.shaderSource( shader, this.source );
    gl.compileShader( shader );

    if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

        throw new Error( gl.getShaderInfoLog( shader ) );

    }

    return shader;

};


/**
 * @memberof Picimo.render.ShaderSource
 * @constant VERTEX_SHADER
 * @static
 */

ShaderSource.VERTEX_SHADER = 'VERTEX_SHADER';

/**
 * @memberof Picimo.render.ShaderSource
 * @constant FRAGMENT_SHADER
 * @static
 */

ShaderSource.FRAGMENT_SHADER = 'FRAGMENT_SHADER';

