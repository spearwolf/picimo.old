import eventize from '@spearwolf/eventize';
import * as utils from '../../utils';
import NodeState from '../node_state';

import defineReady from './ready';
import defineRenderPrio from './render_prio';
import renderFrame from './render_frame';
import destroy from './destroy';


export default function Node (app, options = {}) {

    if ( ! app ) {
        throw new Error('[Picimo.graph.Node] app should not be undefined!');
    }

    utils.object.definePropertyPublicRO(this, 'app', app);

    this.name = utils.asString(options.name);

    this.state = new NodeState(NodeState.CREATE);
    this.display = utils.asBoolean(options.display, true);
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

function setParentNode (node, parent) {
    Object.defineProperty(node, 'parentNode', {
        value: ( parent instanceof Node ? parent : null ),
        configurable: true
    });
}

function sortChildrenByRenderPrio () {
    this.children = this.children.sort(sortByRenderPrio);
}

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

Node.prototype.renderFrame = renderFrame;  // => render_frame.js
Node.prototype.destroy = destroy;  // => destroy.js

// ----------------------------------------------------------
//
// node.appendChild( node ) -> node
//
// PUBLISH EVENTS
// - childrenUpdated
//
// ----------------------------------------------------------

Node.prototype.appendChild = function (node) {

    if (this.children.indexOf(node) !== -1) return node;

    this.children.push(node);

    setParentNode(node, this);

    this.emit('childrenUpdated');

    return node;

};

// ----------------------------------------------------------
//
// node.removeChild( node ) -> node
//
// PUBLISH EVENTS
// - childrenUpdated
//
// ----------------------------------------------------------

Node.prototype.removeChild = function (node) {

    var idx = this.children.indexOf(node);

    if (idx === -1) return node;

    this.children.splice(idx, 1);

    setParentNode(node, null);

    this.emit('childrenUpdated');

    return node;

};

// ----------------------------------------------------------
//
// node.findNode( str ) -> node?
//
// ----------------------------------------------------------

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

