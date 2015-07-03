(function(){
    "use strict";

    /**
     * @namespace Picimo.core
     */

    module.exports = {

        Resource               : require( './resource' ),

        AABB2                  : require( './aabb2' ),
        Viewport               : require( './viewport' ),

        Po2Image               : require( './po2image' ),
        Texture                : require( './texture' ),
        TextureAtlas           : require( './texture_atlas' ),

        VertexArray            : require( './vertex_array' ),
        VertexIndexArray       : require( './vertex_index_array' ),

        VertexObject           : require( './vertex_object' ),
        VertexObjectDescriptor : require( './vertex_object_descriptor' ),
        VertexObjectPool       : require( './vertex_object_pool' )

    };

})();
