/* global requestAnimationFrame */
(function(){
    "use strict";

    var utils = require( '../utils' );
    var sg    = require( '../sg' );
    var webgl = require( '../webgl' );

    /**
     * @class Picimo.App
     *
     * @classdesc
     *   Create a new picimo app. This is your main app controller.
     *
     *   ##### Initialization
     *
     *   Um eine Picimo App Instanz (und einen WebGL Canvas) zu erzeugen, reicht ein einfacher Aufruf:
     *
     *   ```
     *   var app = new Picimo.App({ *options* });
     *   ```
     *
     *   Es wird ein `<canvas>` Element erzeugt und unterhalb des `<body>` Elements der Seite eingehängt.
     *   Mit der Option **appendTo** kann man an Stelle des `<body>` ein anderes Container Element bestimmen.
     *
     *   Möchte man das `<canvas>` Element selbst erzeugen oder ein vorhandenes verwenden, gibt man dieses einfach als ersten Parameter an:
     *
     *   ```
     *   var app = new Picimo.App(document.getElementById('picimo-canvas'));
     *   ```
     *
     *   oder einfach als **canvas** Option:
     *
     *   ```
     *   var app = new Picimo.App({ canvas: document.getElementById('picimo-canvas') });
     *   ```
     *
     *
     * @param {HTMLCanvasElement|object} [canvas]                   - The canvas dom element or the options.
     * @param {object} [options]                                    - The options.
     * @param {boolean} [options.alpha=false]                       - Create a transparent WebGL canvas.
     * @param {boolean} [options.antialias=false]                   - Enable antialiasing.
     * @param {boolean} [options.stats=false]                       - Create the [ mrdoob/stats.js ]( https://github.com/mrdoob/stats.js/ ) widget and append it to the container element.
     * @param {HTMLCanvasElement} [options.canvas]                  - The canvas dom element.
     * @param {HTMLElement} [options.appendTo=document.body]        - Set the container element. The WebGL Canvas (and the stats element) will be appended to this element. The container element also defines the size of the canvas. If this is the body element you will get an fullscreen WebGL canvas. *When the __canvas__ option is used, this option will be ignored.*
     * @param {string|Picimo.utils.Color} [options.bgColor=#000000] - Background color of the WebGL canvas. Use any CSS color format you like.
     * @param {string} [options.assetBaseUrl]                       - Set the base url prefix for all assets (images, json, ..). As an alternative to this option you could define a global var **PICIMO_ASSET_BASE_URL** before creating your Picimo instance. But the preferred way should be using *assetBaseUrl*!
     */

    function App ( canvas, options ) {

        utils.custom_event.eventize( this );

        /**
         * @member {number} Picimo.App#now - The number of seconds from application start.
         */

        this.now = window.performance.now() / 1000.0;

        if ( typeof canvas === 'object' && ! ( 'nodeName' in canvas ) ) {

            options = canvas;
            canvas  = options.canvas;

        } else if ( options == null ) {

            options = {};

        }

        /**
         * @member {HTMLCanvasElement} Picimo.App#canvas
         */

        canvas = canvas !== undefined ? canvas : document.createElement( "canvas" );
        utils.object.definePropertyPublicRO( this, 'canvas', canvas );

        var parentNode = !! options.appendTo ? options.appendTo : document.body;
        parentNode.appendChild( canvas );
        canvas.classList.add( 'picimo' );


        /**
         * @member {WebGlRenderingContext} Picimo.App#gl
         */

        utils.addGlxProperty( this );

        this.glCtxAttrs = {

            alpha     : ( options.alpha === true ),
            antialias : ( options.antialias === true )

        };

        /**
         * @member {WebGlContext} Picimo.App#glx
         */

        this.glx = createWebGlContext( this );
        this.glx.app = this;

        /**
         * @member {Picimo.utils.Color} Picimo.App#backgroundColor
         */

        this.backgroundColor = new utils.Color( options.bgColor !== undefined ? options.bgColor : ( this.glCtxAttrs.alpha ? 'transparent' : "#000000" ) );

        /**
         * @member {Picimo.webgl.ShaderManager} Picimo.App#shader
         */

        this.shader = new webgl.ShaderManager( this );

        /**
         * @member {Picimo.webgl.WebGlRenderer} Picimo.App#renderer
         */

        this.renderer = new webgl.WebGlRenderer( this );

        /**
         * @member {Picimo.App} Picimo.App#assetBaseUrl - The base url for all assets. May be *undefined*.
         */

        this.assetBaseUrl = window.PICIMO_ASSET_BASE_URL || options.assetBaseUrl;

        /**
         * @member {Picimo.sg.Node} Picimo.App#root - The root node of the scene graph.
         */

        utils.object.definePropertyPublicRO( this, 'root', new sg.Node( this ) );

        /**
         * @member {number} Picimo.App#frameNo - The current frame number.
         */

        this.frameNo = 0;


        this.renderer.initGl();
        this.resize();

        window.addEventListener( 'resize', this.resize.bind( this ), false );

        this.onAnimationFrame = this.renderFrame.bind( this );
        requestAnimationFrame( this.onAnimationFrame );

    }

    /**
     * @member {number} Picimo.App#devicePixelRatio - The device pixel ratio.
     */

    utils.object.definePropertyPublicRO( App.prototype, 'devicePixelRatio', ( window.devicePixelRatio || 1 ) );


    /**
     * @method Picimo.App#resize
     */

    App.prototype.resize = function () {

        var w = Math.round( this.canvas.parentNode.clientWidth * this.devicePixelRatio );
        var h = Math.round( this.canvas.parentNode.clientHeight * this.devicePixelRatio );

        if ( this.width !== w || this.height !== h ) {

            /**
             * @member {number} Picimo.App#width - The _real_ device pixel width.
             */

            this.width = w;

            /**
             * @member {number} Picimo.App#height - The _real_ device pixel height.
             */

            this.height = h;

            if ( this.renderer ) {

                this.renderer.resize();

            }

            if ( this.canvas.width !== w || this.canvas.height !== h ) {

                this.canvas.width  = w;
                this.canvas.height = h;

                this.canvas.style.width  = Math.round( w / this.devicePixelRatio ) + "px";
                this.canvas.style.height = Math.round( h / this.devicePixelRatio ) + "px";

                // TODO resize
                //if ( this.root && this.scene.resize ) {
                    //this.scene.resize(this.glx, w, h);
                //}

            }
        }

    };


    /**
     * @method Picimo.App#renderFrame
     */

    App.prototype.renderFrame = function () {

        this.now = window.performance.now() / 1000.0;
        ++this.frameNo;

        this.renderer.beginFrame();

        if ( this.root ) {

            this.root.renderFrame();

        }

        this.renderer.endFrame();

        requestAnimationFrame( this.onAnimationFrame );

    };


    function createWebGlContext ( app ) {

        var gl;

        try {

            gl = app.canvas.getContext( "webgl", app.glCtxAttrs ) ||
                 app.canvas.getContext( "experimental-webgl", app.glCtxAttrs );

        } catch ( err ) {

            console.error( err );

        }

        if ( ! gl ) {

            throw new Error( "Could not initialize the WebGL context!" );

        }

        return new webgl.WebGlContext( gl );

    }


    module.exports = App;

})();
