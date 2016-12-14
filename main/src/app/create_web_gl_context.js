import { WebGlContext } from '../render';

/**
 * @ignore
 */
export default function ( app ) {

    let gl;

    try {

        gl = app.canvas.getContext( "webgl", app.glCtxAttrs ) ||
             app.canvas.getContext( "experimental-webgl", app.glCtxAttrs );

    } catch ( err ) {

        console.error( err );

    }

    if ( ! gl ) {

        throw new Error( "Could not initialize the WebGL context!" );

    }

    const ctx = new WebGlContext( gl );
    ctx.app = app;

    return ctx;

}

