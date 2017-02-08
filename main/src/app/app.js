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


export default class App {

    constructor (canvas, options) {

        eventize(this);

        /**
         * @private
         */
        this.resize = resize;

        /**
         * @private
         */
        this.renderFrame = renderFrame;

        /**
         * {@link src/app/asset_url_helper.js~getAssetUrl}
         */
        this.getAssetUrl = getAssetUrl;

        /**
         * {@link src/app/asset_url_helper.js~joinAssetUrl}
         */
        this.joinAssetUrl = joinAssetUrl;

        /**
         * {@link src/app/texture_helpers.js~loadTextureAtlas}
         */
        this.loadTextureAtlas = loadTextureAtlas;

        /**
         * {@link src/app/texture_helpers.js~loadTexture}
         */
        this.loadTexture = loadTexture;

        if (typeof window !== 'undefined') {  // TODO wrap window?
            definePropertyPublicRO(this, 'devicePixelRatio', window.devicePixelRatio || 1);
        }

        definePropertyPublicRO(this, 'ready', false);

        /**
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

