import eventize from '@spearwolf/eventize';
import Color from 'color-js';

import { definePropertyPublicRO, definePropertyPrivateRO } from '../utils/object_utils';
import addGlxProperty from '../utils/add_glx_property';
import * as graph from '../graph';
import * as render from '../render';
import * as ui from '../ui';

import resize from './resize';
import renderFrame from './render_frame';
import createWebGlContext from './create_web_gl_context';
import createCanvas from './create_canvas';
import initSpriteFactory from './init_sprite_factory';
import createShaderManager from './create_shader_manager';

import { getUrlDir, getAssetUrl, joinAssetUrl } from './asset_url_helper';
import { loadTextureAtlas, loadTexture } from './texture_helpers';


export default class App {

    constructor (canvas, options) {

        eventize(this);

        this.resize = resize;
        this.renderFrame = renderFrame;
        this.getAssetUrl = getAssetUrl;
        this.joinAssetUrl = joinAssetUrl;
        this.loadTextureAtlas = loadTextureAtlas;
        this.loadTexture = loadTexture;

        if (typeof window !== 'undefined') {  // TODO wrap window?
            definePropertyPublicRO(this, 'devicePixelRatio', window.devicePixelRatio || 1);
        }

        definePropertyPublicRO(this, 'ready', false);

        this.now = window.performance.now() / 1000.0;

        if ( typeof canvas === 'object' && ! ( 'nodeName' in canvas ) ) {
            options = canvas;
            canvas  = options.canvas;
        } else if ( options == null ) {
            options = {};
        }

        createCanvas( this, canvas, options.appendTo );

        definePropertyPrivateRO(this, 'mouseController', new ui.MouseController(this));
        this.mouseController.connect(this); // => forward all mouse events to app

        addGlxProperty( this );

        definePropertyPrivateRO(this, 'glCtxAttrs', {

            alpha     : ( options.alpha === true ),
            antialias : ( options.antialias === true )

        });

        this.glx = createWebGlContext( this );

        this.backgroundColor = new Color( options.bgColor !== undefined ? options.bgColor : ( this.glCtxAttrs.alpha ? 'transparent' : "#000000" ) );

        createShaderManager( this );

        definePropertyPrivateRO( this, 'textureManager', new render.TextureManager(this) );
        definePropertyPrivateRO( this, 'renderer', new render.WebGlRenderer(this) );

        initSpriteFactory( this );

        this.assetBaseUrl = window.PICIMO_ASSET_BASE_URL || options.assetBaseUrl || getUrlDir( ( new URL( window.location.href ) ).origin + "/" );

        this.frameNo = 0;

        definePropertyPublicRO( this, 'scene', new graph.Scene( this, {

            pixelRatio : 1,
            projection : true,
            blendMode  : render.cmd.BlendMode.DEFAULT,

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

