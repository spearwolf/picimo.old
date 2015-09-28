precision mediump float;

varying vec2 v_texCoords;
varying vec2 v_texUnit;
varying vec4 v_color;

uniform sampler2D tex;
/*uniform sampler2D tex0;*/
/*uniform sampler2D tex1;*/
/*uniform sampler2D tex2;*/
/*uniform sampler2D tex3;*/

void main(void) {
    
    vec4 texColor;

    texColor = texture2D(tex, v_texCoords);
    /*if      ( v_texUnit.x == 0.0 ) { tex = texture2D(tex0, v_texCoords); }*/
    /*else if ( v_texUnit.x == 1.0 ) { tex = texture2D(tex1, v_texCoords); }*/
    /*else if ( v_texUnit.x == 2.0 ) { tex = texture2D(tex2, v_texCoords); }*/
    /*else if ( v_texUnit.x == 3.0 ) { tex = texture2D(tex3, v_texCoords); }*/

    gl_FragColor = v_color * texColor;
}
