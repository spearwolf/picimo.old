'use strict';

import {definePropertyPublicRO} from './object_utils';

var UID = 0;

export default function addUid ( obj ) {

    definePropertyPublicRO(obj, 'uid', (++UID));

    return obj;

}

