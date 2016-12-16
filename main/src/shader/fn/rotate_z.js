import rotate from './rotate';

export default function (funcName = 'rotateZ') {
    return rotate(funcName, 0, 0, 1);
}

    //return [

        //`mat4 ${funcName}(float angle)`,
        //'{',
        //'    float s = sin(angle);',
        //'    float c = cos(angle);',
        //'    float oc = 1.0 - c;',
        //'    return mat4(c, -s, 0.0, 0.0, s, c, 0.0, 0.0, 0.0, 0.0, oc + c, 0.0, 0.0, 0.0, 0.0, 1.0);',
        //'}',

    //];

