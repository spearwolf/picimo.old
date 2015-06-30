(function(){
    "use strict";

    /**
     * @namespace Picimo.webgl
     */

    module.exports = {

        ShaderSource  : require( './shader_source' ),
        ShaderManager : require( './shader_manager' ),
        WebGlContext  : require( './web_gl_context' ),
        WebGlRenderer : require( './web_gl_renderer' )

    };

})();
