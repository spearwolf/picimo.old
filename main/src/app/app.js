/* jshint browser:true */
import Color from 'color-js';
import eventize from '@spearwolf/eventize';

import createBlendModes from './create_blend_modes';
import defineGlxProperty from './define_glx_property';
import createCanvas from './create_canvas';
import createShaderManager from './create_shader_manager';
import createWebGlContext from './create_web_gl_context';
import initSpriteFactory from './init_sprite_factory';
import renderFrame from './render_frame';
import resize from './resize';
import { MouseController } from '../ui';
import { Scene } from '../graph';
import { TextureManager, WebGlRenderer } from '../render';
import { definePropertyPublicRO, definePropertyPrivateRO } from '../utils/obj_props';
import { getUrlDir, getAssetUrl, joinAssetUrl } from './asset_url_helper';
import { loadTextureAtlas, loadTexture } from './texture_helpers';

/**
 * @class App
 *
 * @param {?HTMLCanvasELement} canvas
 * @param {Object} [options]
 *
 */

export default class App {

    constructor (canvas, options) {

        eventize( this );

        /** @private */
        this.resize = resize;

        /** @private */
        this.renderFrame = renderFrame;

        /**
         * @function
         * @param {string} url
         * @return {string}
         */
        this.getAssetUrl = getAssetUrl;

        /**
         * @function
         * @param {string} baseUrl
         * @param {string} url
         * @return {string}
         */
        this.joinAssetUrl = joinAssetUrl;

        this.loadTextureAtlas = loadTextureAtlas;
        this.loadTexture = loadTexture;

        if (typeof window !== 'undefined') {  // TODO wrap window?
            definePropertyPublicRO(this, 'devicePixelRatio', window.devicePixelRatio || 1);
        }

        /**
         * App *ready* state.
         * @instance
         * @type {boolean}
         */
        definePropertyPublicRO(this, 'ready', false);

        /**
         * App *time* in ms since startup.
         * @instance
         * @type {float}
         */
        this.now = window.performance.now() / 1000.0;

        if ( typeof canvas === 'object' && ! ( 'nodeName' in canvas ) ) {
            options = canvas;
            canvas  = options.canvas;
        } else if ( options == null ) {
            options = {};
        }

        createCanvas(this, canvas, options.appendTo);

        definePropertyPrivateRO(this, 'mouseController', new MouseController(this));
        this.mouseController.connect(this); // => forward all mouse events to app

        defineGlxProperty(this);

        definePropertyPrivateRO(this, 'glCtxAttrs', {

            alpha     : ( options.alpha === true ),
            antialias : ( options.antialias === true )

        });

        this.glx = createWebGlContext( this );

        this.backgroundColor = new Color( options.bgColor !== undefined ? options.bgColor : ( this.glCtxAttrs.alpha ? 'transparent' : "#000000" ) );

        createBlendModes( this );
        createShaderManager( this );

        definePropertyPrivateRO( this, 'textureManager', new TextureManager(this) );
        definePropertyPrivateRO( this, 'renderer', new WebGlRenderer(this) );

        initSpriteFactory( this );

        this.assetBaseUrl = window.PICIMO_ASSET_BASE_URL || options.assetBaseUrl || getUrlDir( ( new URL( window.location.href ) ).origin + "/" );

        this.frameNo = 0;

        definePropertyPublicRO( this, 'scene', new Scene( this, {

            pixelRatio : 1,
            projection : true,
            blendMode  : this.getBlendMode('default'),

        } ) );

        //------------------------------------------------
        // Enable picimo plugins
        // to hook into app creation and initialization
        //------------------------------------------------

        let app = App.emitReduce('create', this, options);

        app.emit('init');

        app.renderer.onInitGl();
        app.resize();

        if (!this.onAnimationFrame) {  // plugins can predefine onAnimationFrame
            this.onAnimationFrame = app.renderFrame.bind(app);
        }

        requestAnimationFrame(app.onAnimationFrame);

        return app;

    }  // => constructor

}  // => class App

