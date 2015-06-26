(function(){
    "use strict";

    /**
     * @namespace Picimo.core
     */

    module.exports = {

        Viewport               : require( './viewport' ),

        VertexArray            : require( './vertex_array' ),
        VertexIndexArray       : require( './vertex_index_array' ),

        VertexObject           : require( './vertex_object' ),
        VertexObjectDescriptor : require( './vertex_object_descriptor' ),
        VertexObjectPool       : require( './vertex_object_pool' )

    };

})();
