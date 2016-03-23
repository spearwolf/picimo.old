'use strict';

import eventize from 'eventize-js';
import * as utils from '../utils';
import * as graph from '../graph';
import * as render from '../render';
import * as core from '../core';
import * as sprites from '../sprites';
import * as ui from '../ui';
import initSprites from '../sprites/init';

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
 * @param {HTMLCanvasElement} [options.canvas]                  - The canvas dom element.
 * @param {HTMLElement} [options.appendTo=document.body]        - Set the container element. The WebGL Canvas will be appended to this element. The container element also defines the size of the canvas. If this is the body element you will get an fullscreen WebGL canvas. *When the __canvas__ option is used, this option will be ignored.*
 * @param {string|Picimo.utils.Color} [options.bgColor=#000000] - Background color of the WebGL canvas. Use any CSS color format you like.
 * @param {string} [options.assetBaseUrl]                       - Set the base url prefix for all assets (images, json, ..). As an alternative to this option you could define a global var **PICIMO_ASSET_BASE_URL** before creating your Picimo instance. But the preferred way should be using *assetBaseUrl*!
 *
 */

export default function App ( canvas, options ) {

    eventize( this );

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

    var canvasIsPredefined = canvas !== undefined;

    canvas = canvasIsPredefined ? canvas : document.createElement( "canvas" );
    utils.object.definePropertyPublicRO( this, 'canvas', canvas );

    var parentNode;

    if ( ! canvasIsPredefined ) {

        parentNode = options.appendTo ? options.appendTo : document.body;
        parentNode.appendChild( canvas );

    }

    canvas.classList.add( 'picimo' );

    this.mouseController = new ui.MouseController(this);
    this.mouseController.connect(this); // => forward all mouse events to app

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
     * @member {Picimo.render.ShaderManager} Picimo.App#shader
     */

    utils.object.definePropertyPublicRO( this, 'shader', new render.ShaderManager(this) );

    /**
     * @member {Picimo.render.TextureManager} Picimo.App#texture
     */

    utils.object.definePropertyPublicRO( this, 'texture', new render.TextureManager(this) );

    /**
     * @member {Picimo.render.WebGlRenderer} Picimo.App#renderer
     */

    utils.object.definePropertyPublicRO( this, 'renderer', new render.WebGlRenderer(this) );

    /**
     * @member {Picimo.sprites.SpriteFactory} Picimo.App#sprites
     */

    utils.object.definePropertyPublicRO( this, 'sprites', initSprites(sprites.SpriteFactory) );

    /**
     * @member {Picimo.App} Picimo.App#assetBaseUrl - The base url for all assets. May be *undefined*.
     */

    this.assetBaseUrl = window.PICIMO_ASSET_BASE_URL || options.assetBaseUrl || getUrlDir( ( new URL( window.location.href ) ).origin + "/" );

    /**
     * @member {number} Picimo.App#frameNo - The current frame number.
     */

    this.frameNo = 0;

    /**
     * @member {Picimo.graph.Scene} Picimo.App#scene - The root node of the scene graph.
     */

    utils.object.definePropertyPublicRO( this, 'scene', new graph.Scene( this, {

        blendMode: render.cmd.BlendMode.DEFAULT,
        pixelRatio: 1

    } ) );

    //------------------------------------------------
    // Enable picimo plugins
    // to hook into app creation and initialization
    //------------------------------------------------

    let app = App.emitReduce('create', this, options);

    app.emit('init');

    app.renderer.onInitGl();

    if (!this.onAnimationFrame) {
        this.onAnimationFrame = app.renderFrame.bind(app);
    }

    requestAnimationFrame(app.onAnimationFrame);

    return app;

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

        if ( this.canvas.width !== w || this.canvas.height !== h ) {

            this.canvas.width  = w;
            this.canvas.height = h;

            this.canvas.style.width  = Math.round( w / this.devicePixelRatio ) + "px";
            this.canvas.style.height = Math.round( h / this.devicePixelRatio ) + "px";

        }

        if ( this.renderer ) {

            this.renderer.onResize();

        }

        this.emit('resize');

    }

};


/**
 * @method Picimo.App#renderFrame
 */

App.prototype.renderFrame = function () {

    this.now = window.performance.now() / 1000.0;
    ++this.frameNo;
    this.frameTime = this.frameLastTime == null ? 0.0 : this.frameLastTime - this.now;
    this.frameLastTime = this.now;

    this.resize();

    this.emit('frameBegin');

    this.renderer.onStartFrame();

    this.emit('frame');

    if (this.scene) {
        this.scene.renderFrame();
    }

    this.emit('renderFrame');

    this.renderer.onEndFrame();

    this.emit('frameEnd');

    requestAnimationFrame(this.onAnimationFrame);

};


var regExpAbsHttpUrl = new RegExp( '^(https?:)?//', 'i' );
var regExpAbsUrlPath = new RegExp( '^(https?:)?/', 'i' );
var regExpUrlDir     = new RegExp( '^(.*/)[^/]+$', 'i' );

/**
 * @method Picimo.App#getAssetUrl
 * @param {string} url
 * @return {string} url
 */

App.prototype.getAssetUrl = function ( url ) {

    var assetUrl;

    if ( this.assetBaseUrl === undefined ) {

        assetUrl = url;

    } else {

        if ( regExpAbsHttpUrl.test( url ) ) {

            if ( url[ 0 ] === '/' && this.assetBaseUrl[ this.assetBaseUrl.length - 1 ] === '/' ) {

                assetUrl = this.assetBaseUrl + url.substr( 1 );

            } else {

                assetUrl = this.assetBaseUrl + url;

            }

        } else {

            assetUrl = url;

        }

    }

    return assetUrl;

};

/**
 * @method Picimo.App#joinAssetUrl
 * @param {string} baseUrl
 * @param {string} url
 * @return {string} url
 */

App.prototype.joinAssetUrl = function ( baseUrl, url ) {

    if ( regExpAbsUrlPath.test( url ) ) {

        return url;

    }

    return this.getAssetUrl( getUrlDir( baseUrl ? baseUrl : this.assetBaseUrl ) + url );

};

function getUrlDir ( url ) {

    if (url[url.length - 1] === '/') return url;
    return regExpUrlDir.exec(url)[1];

}


/**
 * @method Picimo.App#loadTextureAtlas
 * @param {string} url
 * @return {Promise} promise
 */

App.prototype.loadTextureAtlas = function ( url ) {

    return new core.TextureAtlas( this ).load( url ).promise;

};


/**
 * Load an image and create a texture with it.
 * @method Picimo.App#loadTexture
 * @param {string} url
 * @return {Promise} promise will be fulfilled with a Picimo.core.Texture
 */

App.prototype.loadTexture = function ( url ) {

    var image = new core.Po2Image(this).load(url);

    var texture = new core.Texture();
    texture.image = image;

    return image.promise.then(() => texture);

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

    return new render.WebGlContext( gl );

}


eventize(App);  // Enable plugins via Picimo.App.on('create', function (app, options))


