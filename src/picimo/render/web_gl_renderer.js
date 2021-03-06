'use strict';

import _ from 'lodash';
import * as utils from '../utils';
import { BlendMode } from './cmd';
import renderCommand from './web_gl_renderer/render_command';

/**
 * @class Picimo.render.WebGlRenderer
 */

export default function WebGlRenderer ( app ) {

    /**
     * @member {Picimo.App} Picimo.render.WebGlRenderer#app
     * @readonly
     */
    utils.object.definePropertyPublicRO(this, 'app', app);

    initialize(this);
    initializePipelines(this);

}

function initialize ( renderer ) {  // {{{

    renderer.cmdQueue = new utils.Queue;
    renderer._renderCmd = null;

    renderer.uniforms = new Map;
    renderer.attributes = new Map;

    renderer.program = null;
    renderer.currentProgram = null;
    renderer.currentPipeline = null;

    renderer.defaultBlendMode = BlendMode.DEFAULT;  // TODO let defaultBlendMode be configurable from outside (eg. Picimo.App)
    renderer.currentBlendMode = null;

    renderer.renderToTexture = null;

    renderer.debugOutFrame = false;

}
// }}}
function initializePipelines ( renderer ) {  // {{{

    // TODO

    renderer.pipeline = new Map;
    renderer.pipelines = [];

    //renderer.addPipeline( 'images', new SpritePipeline(re, "sprite", 1024, re.app.spriteDescriptor ));

}
// }}}

WebGlRenderer.prototype.filterPipelineByInstanceof = function ( type ) {
    return _.filter(this.pipelines, (pipe) => pipe instanceof type);
};

WebGlRenderer.prototype.onInitGl = function () {
    // nothing to do here
};

WebGlRenderer.prototype.onResize = function () {

    const app = this.app;
    app.gl.viewport( 0, 0, app.width, app.height );

};

WebGlRenderer.prototype.onStartFrame = function () {

    resetInternalRenderState( this );
    callPipelines( this, "reset" );
    resetWebGlState( this );
    this.activateBlendMode( this.defaultBlendMode );

};

function resetWebGlState ( renderer ) {  // {{{

    var gl = renderer.app.gl;
    var bgColor = renderer.app.backgroundColor;

    gl.clearColor( bgColor.getRed(), bgColor.getGreen(), bgColor.getBlue(), bgColor.getAlpha() );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

}
// }}}
function resetInternalRenderState ( renderer ) {  // {{{

    renderer.cmdQueue.clear();

    renderer.currentPipeline  = null;
    renderer.renderToTexture  = null;

    renderer.currentProgram = null;

    renderer.debugOutFrame = renderer.app.frameNo === 120;

}
// }}}


WebGlRenderer.prototype.activateBlendMode = function ( blendMode ) {

    if ( this.currentBlendMode !== blendMode ) {

        this.currentBlendMode = blendMode;
        if ( blendMode ) blendMode.activate( this.app.gl );

    }

};


WebGlRenderer.prototype.onEndFrame = function () {

    renderAll( this );

};


/**
 * @method Picimo.render.WebGlRenderer#addPipeline
 * @param {string} name
 * @param {object} pipeline
 * @return pipeline
 *
 */

WebGlRenderer.prototype.addPipeline = function ( name, pipeline ) {

    if ( name && ! pipeline ) {

        pipeline = name;
        name = "pipe_" + this.pipelines.length;

    }

    this.pipeline[ name ] = pipeline;
    this.pipelines.push( pipeline );

    return pipeline;

};

/**
 * @method Picimo.render.WebGlRenderer#activatePipeline
 * @param pipeline
 * @return self
 *
 */

WebGlRenderer.prototype.activatePipeline = function ( pipeline ) {

    //if (this.debugOutFrame) {
        //console.debug('renderer: activate pipeline=', pipeline, 'current=', this.currentPipeline);
    //}

    if ( pipeline !== this.currentPipeline ) {

        this.flush();
        this.currentPipeline = pipeline;

    }

    return this;

};

/**
 * @method Picimo.render.WebGlRenderer#addRenderCommand
 * @param cmd
 * @param [pipeline] - activate pipeline before
 *
 */

WebGlRenderer.prototype.addRenderCommand = function ( cmd, pipeline ) {

    if ( pipeline !== undefined ) {

        this.activatePipeline( pipeline );

    }

    if ( cmd.renderToTexture ) {

        this.flush();

    }

    this.cmdQueue.push( cmd );

};

WebGlRenderer.prototype.flush = function () {

    if ( this.currentPipeline && this.currentPipeline.flush ) this.currentPipeline.flush();

};

WebGlRenderer.prototype.dumpCommandQueue = function () {

    this.debugOutFrame = true;

};


function renderAll ( renderer ) {  // {{{

    callPipelines( renderer, "finish" );

    if ( renderer.debugOutFrame ) {

        console.groupCollapsed( "Picimo.render.WebGlRenderer Command Queue (" + renderer.cmdQueue.length + ")" );
        logCommandQueueToConsole( renderer );

    }

    renderCommandQueue( renderer );

    if ( renderer.debugOutFrame ) {

        console.debug( "WebGlRenderer", renderer );
        console.groupEnd();

    }

}
// }}}
function renderCommandQueue ( renderer ) {  // {{{

    var renderCmd = renderer._renderCmd;

    if (!renderCmd) {
        renderCmd = renderer._renderCmd = renderCommand.bind(renderer, renderer);
    }

    renderer.cmdQueue.forEach(renderCmd);

}
// }}}
function logCommandQueueToConsole ( renderer ) {  // {{{

    renderer.cmdQueue.forEach( function ( cmd ) {

        if ('id' in cmd) {
            console.debug(`cmd{${cmd.id}}`, cmd);
        } else {
            console.debug('cmd', cmd);
        }

    });

}
// }}}
function callPipelines ( renderer, funcName ) {  // {{{

    var i;
    var pipe;
    var fn;

    for ( i = renderer.pipelines.length; i--; ) {

        pipe = renderer.pipelines[ i ];
        fn = pipe[ funcName ];

        if ( fn ) fn.call( pipe );

    }

}
// }}}


//function _warn () {
    //console.warn.apply( console, [ '[Picimo.render.WebGlRenderer]'].concat( Array.prototype.slice.apply( arguments ) ) );
//}

