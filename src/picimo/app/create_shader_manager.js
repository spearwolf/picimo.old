'use strict';

import * as utils from '../utils';
import * as render from '../render';
import { DefaultShader } from '../shader';

/**
 * @private
 */
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

    const complexSpriteShaderName = 'picimo.complexSprite';
    app.defineVertexShader(complexSpriteShaderName, DefaultShader.ComplexSprite.VertexShader);
    app.defineFragmentShader(complexSpriteShaderName, DefaultShader.ComplexSprite.FragmentShader);
    app.addProgram(complexSpriteShaderName, complexSpriteShaderName, complexSpriteShaderName);

    const spriteShaderName = 'picimo.sprite';
    app.defineVertexShader(spriteShaderName, DefaultShader.Sprite.VertexShader);
    app.defineFragmentShader(spriteShaderName, DefaultShader.Sprite.FragmentShader);
    app.addProgram(spriteShaderName, spriteShaderName, spriteShaderName);

}

