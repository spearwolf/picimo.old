(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.webgl.WebGlRenderer
     */

    function WebGlRenderer ( app ) {

        /**
         * @member {Picimo.App} Picimo.webgl.WebGlRenderer#app
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'app', app );

    }


    /**
     * @method Picimo.webgl.WebGlRenderer#beginFrame
     */

    WebGlRenderer.prototype.beginFrame = function () {

        var gl = this.app.gl;
        var bgColor = this.app.backgroundColor;

        gl.clearColor( bgColor.getRed(), bgColor.getGreen(), bgColor.getBlue(), bgColor.getAlpha() );
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    };


    /**
     * @method Picimo.webgl.WebGlRenderer#endFrame
     */

    WebGlRenderer.prototype.endFrame = function () {

    };


    /**
     * @method Picimo.webgl.WebGlRenderer#initGl
     */

    WebGlRenderer.prototype.initGl = function () {

        var gl = this.app.gl;

        gl.activeTexture( gl.TEXTURE0 ); // TODO remove

    };


    /**
     * @method Picimo.webgl.WebGlRenderer#resize
     */

    WebGlRenderer.prototype.resize = function () {

        var app = this.app;
        var gl  = this.app.gl;

        gl.viewport( 0, 0, app.width, app.height );

    };


    module.exports = WebGlRenderer;

})();
