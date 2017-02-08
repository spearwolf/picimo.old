/* jshint esversion:6 */
import { definePropertyPublicRO } from './obj_props';

let g_uid = 0;

export default function ( obj ) {

    definePropertyPublicRO(obj, 'uid', (++g_uid));

    return obj;

}

