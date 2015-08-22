(function(){
    "use strict";

    /**
     * @namespace Picimo.webgl
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

    };

})();
