/*

[ (xw, yh), (w, h) ], [ (sx, sy), (x, y) ], [ (s, t), (rot, tex) ], [ (r, g), (b, a) ]

(16 attrs per vertex)

pos: x, y -> ( xw * w * sx + x, yh * h * sy + y )
size: w, h
scale: sx, sy
tex-coords: s, t
color+opacity: r, g, b, a

*/
attribute vec2 xwyh;        // wx -> x, yh -> y
attribute vec2 size;        // w -> size.x, h -> size.y
attribute vec2 scale;       // sx -> size.x, sy -> size.y
attribute vec2 pos;         // pos.x, pos.y
/*attribute float rotate;*/
attribute vec2 rot_texUnit;

attribute vec2 texCoords;   // s -> texCoords.x, t -> texCoords.y
/*attribute int texUnit;*/
attribute vec4 color;

uniform mat4 projectionMatrix;
uniform float renderPrio;

varying vec2 v_texCoords;
varying vec2 v_texUnit;
varying vec4 v_color;


mat4 rotateZ(float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, oc + c, 0.0, 0.0, 0.0, 0.0, 1.0);
}

void main(void)
{
    mat4 rotationMatrix = rotateZ(rot_texUnit.x);
    vec2 pos2d = xwyh * size * scale;

    gl_Position = projectionMatrix * ((rotationMatrix * vec4( pos2d, renderPrio, 1.0 )) + vec4(pos.xy, 0.0, 1.0));

    v_texCoords = texCoords;
    v_texUnit = vec2(rot_texUnit.y, 0);
    v_color = color;
}

