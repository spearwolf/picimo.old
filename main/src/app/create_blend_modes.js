import BlendMode from '../render/blend_mode';
import { definePropertyPrivateRO } from '../utils/obj_props';

export default function (app) {

    definePropertyPrivateRO(app, 'predefinedBlendModes', new Map);

    app.getBlendMode = function (name) {
        return this.predefinedBlendModes.get(name);
    };

    app.setBlendMode = function (name, blendMode) {
        this.predefinedBlendModes.set(name, blendMode);
    };

/*
    // good default settings
    gl.enable(gl.DEPTH_TEST);
    gl.depthMask(true);       // enable writing into the depth buffer
    //gl.depthFunc(gl.ALWAYS);  // sprites blending
    gl.depthFunc(gl.LEQUAL);  // iso3d

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);  // good default
*/

    app.setBlendMode('default',
        new BlendMode( true, true, 'ALWAYS', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' ));

    //app.setBlendMode('iso3d',
        //new BlendMode( true, true, 'LEQUAL', true, 'SRC_ALPHA', 'ONE_MINUS_SRC_ALPHA' ));

}

