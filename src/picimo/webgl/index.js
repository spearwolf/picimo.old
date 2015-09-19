(function(){
    "use strict";

    /**
     * @namespace Picimo.webgl
     * @description
     * <img src="images/picimo-rendering-pipeline.png" srcset="images/picimo-rendering-pipeline.png 1x" alt="Picimo rendering pipeline">
     */

    module.exports = {

        cmd : require( './cmd' ),
        Program : require( './program' ),

        ShaderSource   : require( './shader_source' ),
        ShaderManager  : require( './shader_manager' ),
        TextureManager : require( './texture_manager' ),

        WebGlContext  : require( './web_gl_context' ),
        WebGlRenderer : require( './web_gl_renderer' ),
        WebGlProgram  : require( './web_gl_program' ),
        WebGlTexture  : require( './web_gl_texture' ),
        WebGlBuffer   : require( './web_gl_buffer' ),

    };

})();
