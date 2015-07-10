(function(){
    "use strict";

    /**
     * @namespace Picimo.sg
     * @summary
     * Scene-graph related objects and classes.
     */

    module.exports = {

        Scene       : require( './scene' ),
        SpriteGroup : require( './sprite_group' ),

        Node        : require( './node' ),
        NodeState   : require( './node_state' ),

    };

})();
