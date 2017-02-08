/* jshint esversion:6 */
import delegateMethods from '../utils/delegate_methods';
import { DefaultShader } from '../shader';
import { ShaderManager } from '../render';
import { definePropertyPrivateRO } from '../utils/obj_props';

/**
 * @ignore
 */
export default function ( app ) {

    const shaderManager = new ShaderManager( app );

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

