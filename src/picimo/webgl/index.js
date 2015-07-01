(function(){
    "use strict";

    /**
     * @namespace Picimo.webgl
     */

    module.exports = {

        ShaderSource  : require( './shader_source' ),
        ShaderManager : require( './shader_manager' ),
        Program       : require( './program' ),
        WebGlContext  : require( './web_gl_context' ),
        WebGlRenderer : require( './web_gl_renderer' ),
        WebGlProgram  : require( './web_gl_program' )

    };

})();
