precision mediump float;

//varying vec2 vTextureCoord;
varying vec4 vTextureCoordScaleOpacity;

uniform sampler2D tex;

void main(void) {
    gl_FragColor = vTextureCoordScaleOpacity.z * texture2D(tex, vec2(vTextureCoordScaleOpacity.s, vTextureCoordScaleOpacity.t));
}
