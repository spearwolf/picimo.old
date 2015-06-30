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

        var self = this;

        this._promise = new utils.Promise( function ( resolve, reject ) {

            self._resolve = resolve;
            self._reject  = reject;

            if ( self.ready ) {

                resolve( source );

            }

        });

    }


    Object.defineProperties( ShaderSource.prototype, {

        'source': {

            get: function () { return this._source; },

            set: function ( source ) {

                this._source = source;

                /**
                 * @member {boolean} Picimo.webgl.ShaderSource#ready
                 */
                this.ready = typeof source === 'string' && source.trim().length !== 0;

            },

            enumerable: true

        }

    });


    /**
     * @method Picimo.webgl.ShaderSource#getSource
     * @param {function} resolve
     */

    ShaderSource.prototype.getSource = function ( resolve ) {

        if ( this.ready ) {

            resolve( this.source );

        } else {

            this._promise.then( function ( self ) {

                resolve( self.source );

            });

        }

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
                self._resolve( self );

            } else {

                self._reject( new Error( req.statusText ) );

            }

            delete self._resolve;
            delete self._reject;

        };

        req.send();

        return this;

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
