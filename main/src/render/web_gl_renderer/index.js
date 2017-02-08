/* jshint esversion:6 */
/* jshint -W058 */
import _ from 'lodash';
import Queue from '../../utils/queue';
import renderCommand from './render_command';
import BlendMode from '../blend_mode';
import { definePropertyPublicRO } from '../../utils/obj_props';

export default class WebGlRenderer {

        constructor ( app ) {

        /**
         * @member {Picimo.App} Picimo.render.WebGlRenderer#app
         * @readonly
         */
        definePropertyPublicRO(this, 'app', app);

        initialize(this);
        initializePipelines(this);

    }

    filterPipelineByInstanceof ( type ) {
        return _.filter(this.pipelines, (pipe) => pipe instanceof type);
    }

    onInitGl () {
        // nothing to do here
    }

    onResize () {

        const app = this.app;
        app.gl.viewport( 0, 0, app.width, app.height );

    }

    onStartFrame () {

        resetInternalRenderState( this );
        callPipelines( this, "reset" );
        resetWebGlState( this );
        this.activateBlendMode( this.defaultBlendMode );

    }

    activateBlendMode ( blendMode ) {

        if ( this.currentBlendMode !== blendMode ) {

            this.currentBlendMode = blendMode;
            if ( blendMode ) blendMode.activate( this.app.gl );

        }

    }

    onEndFrame () {

        renderAll( this );

    }

    /**
     * @param {string} name
     * @param {object} pipeline
     * @return pipeline
     */
    addPipeline ( name, pipeline ) {

        if ( name && ! pipeline ) {

            pipeline = name;
            name = "pipe_" + this.pipelines.length;

        }

        this.pipeline[ name ] = pipeline;
        this.pipelines.push( pipeline );

        return pipeline;

    }

    /**
     * @param pipeline
     * @return self
     */
    activatePipeline ( pipeline ) {

        if ( pipeline !== this.currentPipeline ) {

            this.flush();
            this.currentPipeline = pipeline;

        }

        return this;

    }

    /**
     * @param cmd
     * @param [pipeline] - activate pipeline before
     */
    addRenderCommand ( cmd, pipeline ) {

        if ( pipeline !== undefined ) {

            this.activatePipeline( pipeline );

        }

        if ( cmd.renderToTexture ) {

            this.flush();

        }

        this.cmdQueue.push( cmd );

    }

    flush () {

        if ( this.currentPipeline && this.currentPipeline.flush ) this.currentPipeline.flush();

    }

    dumpCommandQueue () {

        this.debugOutFrame = true;

    }

}


/**
 * @ignore
 */
function resetWebGlState ( renderer ) {  // {{{

    var gl = renderer.app.gl;
    var bgColor = renderer.app.backgroundColor;

    gl.clearColor( bgColor.getRed(), bgColor.getGreen(), bgColor.getBlue(), bgColor.getAlpha() );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

}
// }}}

/**
 * @ignore
 */
function resetInternalRenderState ( renderer ) {  // {{{

    renderer.cmdQueue.clear();

    renderer.currentPipeline  = null;
    renderer.renderToTexture  = null;

    renderer.currentProgram = null;

    renderer.debugOutFrame = renderer.app.frameNo === 120;

}
// }}}

/**
 * @ignore
 */
function initialize ( renderer ) {  // {{{

    renderer.cmdQueue = new Queue;
    renderer._renderCmd = null;

    renderer.uniforms = new Map;
    renderer.attributes = new Map;

    renderer.program = null;
    renderer.currentProgram = null;
    renderer.currentPipeline = null;

    renderer.defaultBlendMode = BlendMode.get('default');  // TODO let defaultBlendMode be configurable from outside (eg. Picimo.App)
    renderer.currentBlendMode = null;

    renderer.renderToTexture = null;

    renderer.debugOutFrame = false;

}
// }}}

/**
 * @ignore
 */
function initializePipelines ( renderer ) {  // {{{

    // TODO

    renderer.pipeline = new Map;
    renderer.pipelines = [];

    //renderer.addPipeline( 'images', new SpritePipeline(re, "sprite", 1024, re.app.spriteDescriptor ));

}
// }}}

/**
 * @ignore
 */
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

/**
 * @ignore
 */
function renderCommandQueue ( renderer ) {  // {{{

    var renderCmd = renderer._renderCmd;

    if (!renderCmd) {
        renderCmd = renderer._renderCmd = renderCommand.bind(renderer, renderer);
    }

    renderer.cmdQueue.forEach(renderCmd);

}
// }}}

/**
 * @ignore
 */
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

/**
 * @ignore
 */
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

