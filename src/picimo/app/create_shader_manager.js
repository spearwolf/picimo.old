'use strict';

import * as utils from '../utils';
import * as render from '../render';

export default function ( app ) {

    const shaderManager = new render.ShaderManager( app );

    utils.object.definePropertyPrivateRO( app, 'shaderManager', shaderManager );

    utils.delegateMethods(shaderManager, app, [
        'loadFragmentShader',
        'loadVertexShader',
        'getVertexShader',
        'getFragmentShader',
        'getProgram'
    ]);

    app.addProgram = function () {
        shaderManager.addProgram.apply(shaderManager, arguments);
        return app;
    };

    app.defineVertexShader = function () {
        shaderManager.defineVertexShader.apply(shaderManager, arguments);
        return app;
    };

    app.defineFragmentShader = function () {
        shaderManager.defineFragmentShader.apply(shaderManager, arguments);
        return app;
    };

}

