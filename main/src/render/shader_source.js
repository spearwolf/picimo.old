import _ from 'lodash';
import { Resource } from '../core';

export default class ShaderSource extends Resource {

    /**
     * @param {App} app
     * @param {string} shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
     * @param {string} name - name
     * @param {string} [source] - source
     */
    constructor (app, shaderType, name, source) {
        super(app, 'source');

        /**
         * @type {string} shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
         */
        this.shaderType = shaderType;

        /**
         * @type {string}
         */
        this.name = name;

        /**
         * @type {string}
         */
        this.source = source;
    }

    /**
     * @param {WebGlContext} glx
     * @return {WebGLShader} - render shader object or *undefined*
     */
    compile ( glx ) {

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

    }

}

ShaderSource.VERTEX_SHADER = 'VERTEX_SHADER';
ShaderSource.FRAGMENT_SHADER = 'FRAGMENT_SHADER';


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

