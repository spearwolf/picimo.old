import { definePropertyPublicRO } from './object_utils';

let UID = 0;

export default function addUid ( obj ) {

    definePropertyPublicRO(obj, 'uid', (++UID));

    return obj;

}

