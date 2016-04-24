'use strict';

import { rotate } from '../fn';

export const VertexShader = [
`
    attribute vec2 pos2d;
    attribute float posZ;
    attribute vec2 uv;
    attribute vec2 translate;
    attribute float rotate;
    attribute float scale;
    attribute float opacity;

    uniform mat4 viewMatrix;

    varying vec4 vTextureCoordScaleOpacity;`,

    rotate('rotateZ', 0.0, 0.0, 1.0),
`
    void main(void)
    {
        mat4 rotationMatrix = rotateZ(rotate);
        gl_Position = viewMatrix * ((rotationMatrix * (vec4(scale, scale, scale, 1.0) * vec4(pos2d.xy, posZ, 1.0))) + vec4(translate.xy, 0.0, 0.0));
        vTextureCoordScaleOpacity = vec4(uv.xy, opacity, 0.0);
    }
`
];

export const FragmentShader = [
`
    precision mediump float;

    varying vec4 vTextureCoordScaleOpacity;
    uniform sampler2D tex;

    void main(void) {
        gl_FragColor = vTextureCoordScaleOpacity.z * texture2D(tex, vec2(vTextureCoordScaleOpacity.s, vTextureCoordScaleOpacity.t));
    }
`
];

