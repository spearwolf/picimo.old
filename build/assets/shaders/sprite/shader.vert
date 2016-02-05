attribute vec2 pos2d;
attribute float posZ;
attribute vec2 uv;
attribute vec2 translate;
attribute float rotate;
attribute float scale;
attribute float opacity;

uniform mat4 projectionMatrix;

varying vec4 vTextureCoordScaleOpacity;


mat4 rotateZ(float angle)
{
    vec3 axis = vec3(0.0, 0.0, 1.0);

    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main(void)
{
    mat4 rotationMatrix = rotateZ(rotate);
    gl_Position = projectionMatrix * ((rotationMatrix * (vec4(scale, scale, scale, 1.0) * vec4(pos2d.xy, posZ, 1.0))) + vec4(translate.xy, 0.0, 0.0));
    vTextureCoordScaleOpacity = vec4(uv.xy, opacity, 0.0);
}
