(function(){
    "use strict";

    var utils = require( '../utils' );
    var VertexArray = require( './vertex_array' );

    function VertexArrayDescriptor ( descriptor ) {

        utils.object.definePropertiesPublicRO( descriptor );

        Object.freeze( this );

    }

    VertexArrayDescriptor.prototype.createVertexArray = function ( size ) {

        return new VertexArray( this, ( size === undefined ? 1 : size ) );

    };

    module.exports = VertexArrayDescriptor;

})();
