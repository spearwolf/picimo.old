'use strict';

import { rotateZ } from '../fn';

/*

[ (xw, yh), (w, h) ], [ (sx, sy), (x, y) ], [ (s, t), (rot, tex) ], [ (r, g), (b, a) ]

(16 attrs per vertex)

pos: x, y -> ( xw * w * sx + x, yh * h * sy + y )
size: w, h
scale: sx, sy
tex-coords: s, t
color+opacity: r, g, b, a

*/
export const VertexShader = [

    'attribute vec2 xwyh;',        // wx -> x, yh -> y
    'attribute vec2 size;',        // w -> size.x, h -> size.y
    'attribute vec2 scale;',       // sx -> size.x, sy -> size.y
    'attribute vec2 pos;',         // pos.x, pos.y
    'attribute vec2 rot_texUnit;',

    'attribute vec2 texCoords;',   // s -> texCoords.x, t -> texCoords.y
    'attribute vec4 color;',

    'uniform mat4 viewMatrix;',
    'uniform float renderPrio;',

    'varying vec2 v_texCoords;',
    'varying vec2 v_texUnit;',
    'varying vec4 v_color;',

    rotateZ(),

    'void main(void)',
    '{',
    '    mat4 rotationMatrix = rotateZ(rot_texUnit.x);',
    '    vec2 pos2d = xwyh * size * scale;',

    '    gl_Position = viewMatrix * ((rotationMatrix * vec4( pos2d, renderPrio, 1.0 )) + vec4(pos.xy, 0.0, 1.0));',

    '    v_texCoords = texCoords;',
    '    v_texUnit = vec2(rot_texUnit.y, 0);',
    '    v_color = color;',
    '}',

];

export const FragmentShader = [

    'precision mediump float;',

    'varying vec2 v_texCoords;',
    'varying vec2 v_texUnit;',
    'varying vec4 v_color;',

    'uniform sampler2D tex;',
    /*uniform sampler2D tex0;*/
    /*uniform sampler2D tex1;*/
    /*uniform sampler2D tex2;*/
    /*uniform sampler2D tex3;*/

    'void main(void)',
    '{',
    '    vec4 texColor;',

    '    texColor = texture2D(tex, v_texCoords);',
    //'    texColor.x = texColor.x + 0.5;',
    //'    texColor.w = texColor.w + 0.5;',
         /*if      ( v_texUnit.x == 0.0 ) { tex = texture2D(tex0, v_texCoords); }*/
         /*else if ( v_texUnit.x == 1.0 ) { tex = texture2D(tex1, v_texCoords); }*/
         /*else if ( v_texUnit.x == 2.0 ) { tex = texture2D(tex2, v_texCoords); }*/
         /*else if ( v_texUnit.x == 3.0 ) { tex = texture2D(tex3, v_texCoords); }*/

    '    gl_FragColor = v_color * texColor;',
    '}',

];

