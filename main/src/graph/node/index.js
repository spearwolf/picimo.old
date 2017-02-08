/* jshint esversion:6 */
import eventize from '@spearwolf/eventize';

import NodeState from '../node_state';
import defineReady from './ready';
import defineRenderPrio from './render_prio';
import destroy from './destroy';
import renderFrame from './render_frame';
import { asString, asBoolean } from '../../utils/as';
import { definePropertyPublicRO } from '../../utils/obj_props';


export default function Node (app, options = {}) {

    if ( ! app ) {
        throw new Error('[Picimo.graph.Node] app should not be undefined!');
    }

    definePropertyPublicRO(this, 'app', app);

    this.name = asString(options.name);

    this.state = new NodeState(NodeState.CREATE);
    this.display = asBoolean(options.display, true);
    defineReady(this, options.ready !== false);

    Object.defineProperties(this, {
        initDone: {
            value        : false,
            configurable : true,
            enumerable   : true
        },
        initGlDone: {
            value        : false,
            configurable : true,
            enumerable   : true
        }
    });

    defineRenderPrio(this, options.renderPrio);

    setParentNode(this, options.parentNode);
    this.children = [];

    eventize(this);

    this.on('childrenUpdated', eventize.PRIO_MAX, sortChildrenByRenderPrio);

    this.connect( options, {

        'onInit'            : 'init',
        'onInitGl'          : 'initGl',
        'onFrame'           : 'frame',
        'onRenderFrame'     : 'renderFrame',
        'onFrameEnd'        : 'frameEnd',
        'onDestroyGl'       : 'destroyGl',
        'onDestroy'         : 'destroy',
        'onChildrenUpdated' : 'childrenUpdated',

    });

}

/**
 * @ignore
 */
function setParentNode (node, parent) {
    Object.defineProperty(node, 'parentNode', {
        value: ( parent instanceof Node ? parent : null ),
        configurable: true
    });
}

/**
 * @ignore
 */
function sortChildrenByRenderPrio () {
    this.children = this.children.sort(sortByRenderPrio);
}

/**
 * @ignore
 */
function sortByRenderPrio (a, b) {
    return -a.renderPrio - ( -b.renderPrio );
}


// ----------------------------------------------------------
//
// node.isRootNode -> *boolean*
//
// ----------------------------------------------------------

Object.defineProperties( Node.prototype, {

    'isRootNode': {

        get: function () { return ! this.parentNode; },
        enumerable: true

    },

});

/**
 * {@link src/graph/node/render_frame.js~renderFrame}
 */
Node.prototype.renderFrame = renderFrame;

/**
 * {@link src/graph/node/destroy.js~destroy}
 */
Node.prototype.destroy = destroy;


// ----------------------------------------------------------
//
// PUBLISH EVENTS
// - childrenUpdated
//
// ----------------------------------------------------------

/**
 * @param {Node} node
 * @return {Node} node
 */
Node.prototype.appendChild = function (node) {

    if (this.children.indexOf(node) !== -1) return node;

    this.children.push(node);

    setParentNode(node, this);

    this.emit('childrenUpdated');

    return node;

};


// ----------------------------------------------------------
//
// PUBLISH EVENTS
// - childrenUpdated
//
// ----------------------------------------------------------

/**
 * @param {Node} node
 * @return {Node} node
 */
Node.prototype.removeChild = function (node) {

    var idx = this.children.indexOf(node);

    if (idx === -1) return node;

    this.children.splice(idx, 1);

    setParentNode(node, null);

    this.emit('childrenUpdated');

    return node;

};


/**
 * @param {string} name
 * @return {Node} node
 */
Node.prototype.findNode = function (name) {

    if (!name) return;
    if (this.name === name) return this;

    let node, i, len;

    for (i = 0, len = this.children.length; i < len; ++i ) {

        node = this.children[i].findNode(name);
        if (node) {
            return node;
        }

    }

};

