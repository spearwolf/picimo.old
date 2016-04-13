'use strict';

import _ from 'lodash';
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
 * @param {Picimo.render.WebGlContext} gl
 * @return {WebGLShader} - render shader object or *undefined*
 */

ShaderSource.prototype.compile = function ( glx ) {

    if ( ! this.ready ) return;

    const gl = glx.gl;

    var shader = gl.createShader( gl[ this.shaderType ] );

    if (typeof this.source !== 'string') {
        this.source = sourceToStr({
            shaderSource: this,
                     glx: glx
        }, this.source);
    }

    gl.shaderSource( shader, this.source );
    gl.compileShader( shader );

    if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

        console.error(gl.getShaderInfoLog( shader ));
        console.group('shader-info');
        console.debug('shaderSource', this);
        console.log(this.source);
        console.groupEnd();

        throw new Error('ShaderSource compile error');

    }

    return shader;

};

function sourceToStr (shaderContext, source) {

    //console.debug('sourceToStr', shaderContext, source);

    if (typeof source === 'string') {
        return source;

    } else if (typeof source === 'function') {
        return source(shaderContext);

    } else if (Array.isArray(source)) {

        return _.map(source, sourceToStr.bind(null, shaderContext)).join('\n');

    } else {
        return source+'';
    }

}

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

