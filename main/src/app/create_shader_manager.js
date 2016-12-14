import { definePropertyPrivateRO } from '../utils/object_utils';
import delegateMethods from '../utils/delegate_methods';
import { DefaultShader } from '../shader';
import * as render from '../render';

/**
 * @ignore
 */
export default function ( app ) {

    const shaderManager = new render.ShaderManager( app );

    definePropertyPrivateRO( app, 'shaderManager', shaderManager );

    delegateMethods(shaderManager, app, [
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

