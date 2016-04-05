'use strict';

import eventize from 'eventize-js';

import * as utils from '../utils';
import * as graph from '../graph';
import * as render from '../render';
import * as ui from '../ui';

import { initSprites, defineSprite } from '../sprites';

import resize from './resize';
import renderFrame from './render_frame';
import createWebGlContext from './create_web_gl_context';
import { getUrlDir, getAssetUrl, joinAssetUrl } from './asset_url_helper';
import { loadTextureAtlas, loadTexture } from './texture_helpers';


export default function App ( canvas, options ) {

    eventize( this );

    this.now = window.performance.now() / 1000.0;

    if ( typeof canvas === 'object' && ! ( 'nodeName' in canvas ) ) {

        options = canvas;
        canvas  = options.canvas;

    } else if ( options == null ) {

        options = {};

    }

    utils.object.definePropertyPublicRO( this, 'canvasIsPredefined', canvas !== undefined);

    canvas = this.canvasIsPredefined ? canvas : document.createElement( "canvas" );
    utils.object.definePropertyPublicRO( this, 'canvas', canvas );

    if ( ! this.canvasIsPredefined ) {

        canvas.style.boxSizing   = 'border-box;'
        canvas.style.margin      = '0';
        canvas.style.padding     = '0';
        canvas.style.border      = '0';
        canvas.style.position    = 'absolute';
        canvas.style.top         = '0';
        canvas.style.left        = '0';
        canvas.style.bottom      = '0';
        canvas.style.right       = '0';
        canvas.style.touchAction = 'none';

        let parentNode;
        let containerNode;

        containerNode = document.createElement('div');

        containerNode.style.position    = 'relative';
        containerNode.style.boxSizing   = 'border-box;'
        containerNode.style.margin      = '0';
        containerNode.style.padding     = '0';
        containerNode.style.border      = '0';
        containerNode.style.overflow    = 'hidden';
        containerNode.style.width       = '100%';
        containerNode.style.height      = '100%';
        containerNode.style.touchAction = 'none';

        containerNode.appendChild( canvas );

        parentNode = options.appendTo ? options.appendTo : document.body;
        parentNode.appendChild( containerNode );

    }

    this.mouseController = new ui.MouseController(this);
    this.mouseController.connect(this); // => forward all mouse events to app

    utils.addGlxProperty( this );

    this.glCtxAttrs = {

        alpha     : ( options.alpha === true ),
        antialias : ( options.antialias === true )

    };

    this.glx = createWebGlContext( this );

    this.backgroundColor = new utils.Color( options.bgColor !== undefined ? options.bgColor : ( this.glCtxAttrs.alpha ? 'transparent' : "#000000" ) );

    utils.object.definePropertyPublicRO( this, 'shader', new render.ShaderManager(this) );

    utils.object.definePropertyPublicRO( this, 'texture', new render.TextureManager(this) );
    utils.object.definePropertyPublicRO( this, 'renderer', new render.WebGlRenderer(this) );

    let spriteFactory = initSprites();
    utils.object.definePropertyPublicRO( this, 'spriteFactory', spriteFactory );
    utils.object.definePropertyPublicRO( this, 'defineSprite', function (typeName, spriteOptions, spriteProto) {
        return defineSprite(typeName, spriteOptions, spriteProto, spriteFactory );
    });

    this.assetBaseUrl = window.PICIMO_ASSET_BASE_URL || options.assetBaseUrl || getUrlDir( ( new URL( window.location.href ) ).origin + "/" );

    this.frameNo = 0;

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

    if (!this.onAnimationFrame) {  // plugins can predefine onAnimationFrame
        this.onAnimationFrame = app.renderFrame.bind(app);
    }

    requestAnimationFrame(app.onAnimationFrame);

    return app;

}  // => App


utils.object.definePropertyPublicRO( App.prototype, 'devicePixelRatio', ( window.devicePixelRatio || 1 ) );

App.prototype.resize = resize;
App.prototype.renderFrame = renderFrame;

App.prototype.getAssetUrl = getAssetUrl;
App.prototype.joinAssetUrl = joinAssetUrl;

App.prototype.loadTextureAtlas = loadTextureAtlas;
App.prototype.loadTexture = loadTexture;

