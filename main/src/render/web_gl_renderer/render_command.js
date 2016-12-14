'use strict';

import drawElements from './draw_elements';
import UniformValueStack from './uniform_value_stack';

export default function renderCommand ( re/*nderer*/, cmd ) {

    // blend-mode
    //====================================

    var blendMode;

    if ( cmd.blendMode !== undefined ) {

        if ( cmd.blendMode === false ) {

            blendMode = re.defaultBlendMode;

        } else if ( cmd.blendMode != null ) {

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

    var key, uniformStack;

    if ( cmd.uniforms ) {

        for ( key in cmd.uniforms ) {
            if ( cmd.uniforms.hasOwnProperty( key ) ) {

                uniformStack = re.uniforms.get( key );

                if ( ! uniformStack ) {

                    uniformStack = new UniformValueStack();
                    re.uniforms.set( key, uniformStack );

                }

                uniformStack.exec( cmd.uniforms[ key ] );

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

    var program;

    if ( cmd.program ) {

        if ( typeof cmd.program === 'string' ) {  // Convert program to WebGlProgram

            program = re.app.getProgram( cmd.program );

            if ( ! program ) {

                _warn( 'unknown program:', cmd.program );
                return;

            }

            re.program = re.app.glx.glProgram( program );

            //if (re.debugOutFrame) {
                //console.log('activate program', program);
            //}

        }

    }

    // drawElements
    //=================================================

    if ( cmd.drawElements ) drawElements( re, cmd.drawElements );

}

function _warn () {

    console.warn.apply( console, [ '[Picimo.render.WebGlRenderer#renderCommand]'].concat( Array.prototype.slice.apply( arguments ) ) );

}

