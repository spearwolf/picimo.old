'use strict';

export function publicRO ( target, name, descriptor ) {
    descriptor.enumerable = true;
    descriptor.writable = false;
    descriptor.configurable = false;
    return descriptor;
}

