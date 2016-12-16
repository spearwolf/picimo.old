import { ret, mat4, mul, sub, add } from '../utils';

export default function (funcName = 'rotate', x = 0.0, y = 0.0, z = 1.0) {
    return [

        `mat4 ${funcName}(float angle) {`,

        'float s = sin(angle);',
        'float c = cos(angle);',
        'float oc = 1.0 - c;',

        ret(
            mat4(
                add( mul('oc', x*x), 'c' ),         sub( mul('oc', x*y), mul(z, 's') ), add( mul('oc', z*x), mul(y, 's') ), 0,
                add( mul('oc', x*y), mul(z, 's') ), add( mul('oc', y*y), 'c' ),         sub( mul('oc', y*z), mul(x, 's') ), 0,
                sub( mul('oc', z*x), mul(y, 's') ), add( mul('oc', y*z), mul(x, 's') ), add( mul('oc', z*z), 'c' )
            )
        ),

        '}',

    ];
}

