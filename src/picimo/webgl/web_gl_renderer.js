/* global Int16Array */
(function(){
    "use strict";

    var utils         = require( '../utils' );
    var cmd           = require( './cmd' );
    var renderCommand = require( './web_gl_renderer/render_command' );

    /**
     * @class Picimo.webgl.WebGlRenderer
     */

    function WebGlRenderer ( app ) {

        /**
         * @member {Picimo.App} Picimo.webgl.WebGlRenderer#app
         * @readonly
         */
        utils.object.definePropertyPublicRO( this, 'app', app );

        createRenderState( this );

    }


    /**
     * @method Picimo.webgl.WebGlRenderer#beginFrame
     */

    WebGlRenderer.prototype.beginFrame = function () {

        if ( ! this.pipeline ) initializePipelines( this );

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
        var gl = this.app.gl;

        gl.viewport( 0, 0, app.width, app.height );

    };


    // ============================================================
    //
    // render commands
    //
    // ============================================================

    // flush
    // -----

    WebGlRenderer.prototype.flush = function () {

        if ( this.currentPipeline ) this.currentPipeline.flush();

    };

    // dumpCommandQueue
    // ----------------

    WebGlRenderer.prototype.dumpCommandQueue = function () {

        this.debugOutFrame = true;

    };

    // add( renderCommand )
    // --------------------

    WebGlRenderer.prototype.add = function ( cmd ) {

        if ( cmd.renderToTexture ) this.flush();

        this._cmdQueue.push( cmd );

    };

    // renderAll
    // ---------

    WebGlRenderer.prototype.renderAll = function() {

        for ( var i = this._pipelines.length; i--; ) this._pipelines[ i ].finish();

        //if ( this.debugOutFrame ) this.logCommandQueueToConsole();

        renderCommandQueue( this );

        //if ( this.debugOutFrame ) console.debug("WebGlRenderer", this);

    };

    // _renderCommandQueue
    // -------------------

    function renderCommandQueue ( renderer ) {

        var len = renderer._cmdQueue.length;
        var i;

        for ( i = 0; i < len; i++ ) {

             renderCommand( renderer, renderer._cmdQueue.entries[ i ].data );

        }

    }


    function initializePipelines( renderer ) {

        // TODO
    
        renderer.pipeline = new utils.Map();
        renderer._pipelines = [];

        //renderer.addPipeline( 'images', new SpritePipeline(re, "sprite", 1024, re.app.spriteDescriptor ));
    
    }


    function createRenderState( renderer ) {

        var glx = renderer.app.glx;

        renderer.currentTexUnits = new Int16Array( glx.MAX_TEXTURE_IMAGE_UNITS );
        for ( var i = renderer.currentTexUnits.length; i--; ) renderer.currentTexUnits[ i ] = -1;

        renderer._cmdQueue = new utils.Queue();

        renderer.uniforms         = new utils.Map();
        renderer.attributes       = new utils.Map();
        renderer.program          = null;

        renderer.currentProgram   = null;
        renderer.currentGlTexUnit = null;
        renderer.currentPipeline  = null;

        renderer.defaultBlendMode = cmd.BlendMode.DEFAULT;
        renderer.currentBlendMode = null;

        renderer.renderToTexture  = null;

        renderer.debugOutFrame = false;

    }


    module.exports = WebGlRenderer;

})();
