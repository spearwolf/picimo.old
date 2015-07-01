(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.webgl.ShaderSource
     * @param {string} shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
     * @param {string} name -
     * @param {string} [source]
     */

    function ShaderSource ( shaderType, name, source ) {

        /**
         * @member {number} Picimo.webgl.ShaderSource#uid
         * @readonly
         */
        utils.addUid( this );

        /**
         * @member {Picimo.utils.Deferred} Picimo.webgl.ShaderSource#deferred
         */
        utils.Deferred.make( this );

        /**
         * @member {string} Picimo.webgl.ShaderSource#shaderType - 'VERTEX_SHADER' or 'FRAGMENT_SHADER'
         */
        this.shaderType = shaderType;

        /**
         * @member {string} Picimo.webgl.ShaderSource#name
         */
        this.name = name;

        /**
         * @member {string} Picimo.webgl.ShaderSource#source - The shader source
         */
        this.source = source;

        /**
         * @member {string} Picimo.webgl.ShaderSource#url
         */
        this.url = null;

    }


    Object.defineProperties( ShaderSource.prototype, {

        'source': {

            get: function () { return this._source; },

            set: function ( source ) {

                this._source = source;
                this.deferred.ready = typeof source === 'string' && source.trim().length !== 0;

            },

            enumerable: true

        }

    });


    /**
     * @method Picimo.webgl.ShaderSource#getSource
     * @param {function} resolve
     */

    ShaderSource.prototype.getSource = function ( resolve ) {

        this.deferred.forward( 'source', resolve );

    };


    /**
     * @method Picimo.webgl.ShaderSource#load
     * @param {string} url
     * @return {Picimo.webgl.ShaderSource} - self
     */

    ShaderSource.prototype.load = function ( url ) {

        var self = this;

        this.url = url;

        var req = new XMLHttpRequest();

        req.open( "GET", url, true );

        req.onreadystatechange = function () {

            if ( req.readyState !== 4 /* DONE */ ) return;

            if ( req.status >= 200 && req.status < 300 ) {

                self.source = req.responseText;

            }

        };

        req.send();

        return this;

    };


    /**
     * @method Picimo.webgl.ShaderSource#compile
     * @param {WebGlRenderingContext} gl
     * @return {WebGLShader} - webgl shader object or *undefined*
     */

    ShaderSource.prototype.compile = function ( gl ) {

        if ( ! this.deferred.ready ) return;

        var shader = gl.createShader( gl[ this.shaderType ] );

        gl.shaderSource( shader, this.source );
        gl.compileShader( shader );

        if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {

            throw new Error( gl.getShaderInfoLog( shader ) );

        }

        return shader;

    };


    /**
     * @memberof Picimo.webgl.ShaderSource
     * @constant VERTEX_SHADER
     * @static
     */

    ShaderSource.VERTEX_SHADER = 'VERTEX_SHADER';

    /**
     * @memberof Picimo.webgl.ShaderSource
     * @constant FRAGMENT_SHADER
     * @static
     */

    ShaderSource.FRAGMENT_SHADER = 'FRAGMENT_SHADER';


    module.exports = ShaderSource;

})();
