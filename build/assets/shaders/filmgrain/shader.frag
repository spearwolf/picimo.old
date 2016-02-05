precision mediump float;

varying vec4 vTextureCoordScaleOpacity;

uniform sampler2D tex;

/* based on https://www.shadertoy.com/view/4sXSWs */
uniform vec2      iResolution;           // viewport resolution (in device pixels)
uniform float     iGlobalTime;           // shader playback time (in seconds)

void main(void)
{
	vec2 uv = vTextureCoordScaleOpacity.st; // / iResolution.xy;

    vec4 color = vTextureCoordScaleOpacity.z * texture2D(tex, vec2(vTextureCoordScaleOpacity.s, vTextureCoordScaleOpacity.t));

    float strength = 64.0; //16.0;

    float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (iGlobalTime * 20.0);
	vec4 grain = vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;

    gl_FragColor = color * (1.0 - grain);
}
