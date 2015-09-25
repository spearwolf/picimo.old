(function () {
    'use strict';

    var drawElements = require("./draw_elements");

    module.exports = function renderCommand ( re/*nderer*/, cmd ) {

        // blend-mode
        //====================================

        var blendMode;

        if ( cmd.blendMode !== undefined ) {

            if ( cmd.blendMode === false ) {

                blendMode = re.defaultBlendMode;

            } else if ( cmd.blendMode ) {

                blendMode = cmd.blendMode;

            }

            re.activateBlendMode( blendMode );

        }

        // render-to-texture
        //==========================================

        if ( cmd.renderToTexture !== undefined ) {

            // TODO

            if ( cmd.renderToTexture !== false ) {

                re.renderToTexture = cmd.renderToTexture;
                re.renderToTexture.activate();

            } else {

                re.renderToTexture.deactivate();
                re.renderToTexture = null;

            }

        }

        // uniforms
        //=================================================

        var key;

        if ( cmd.uniforms ) {

            for ( key in cmd.uniforms ) {
                if ( cmd.uniforms.hasOwnProperty( key ) ) {

                    re.uniforms.set( key, cmd.uniforms[ key ] );

                }
            }

        }

        // attributes
        //=================================================

        if ( cmd.attributes ) {

            for ( key in cmd.attributes ) {
                if ( cmd.attributes.hasOwnProperty( key ) ) {

                    re.attributes.set( key, cmd.attributes[ key ] );

                }
            }

        }

        // program
        //=================================================

        if ( cmd.program ) {

            re.program = re.app.glx.glProgram( typeof cmd.program === 'string' ?
                            re.app.shader.getProgram( cmd.program )
                                : cmd.program );

        }

        // drawElements
        //=================================================

        if ( cmd.drawElements ) drawElements( re, cmd.drawElements );

    };

})();
