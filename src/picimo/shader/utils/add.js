'use strict';

const isNumber = (x) => { return typeof x === 'number' };

export default function add (a, b) {

    if (isNumber(a) && isNumber(b)) {

        return a + b;

    } else if (isNumber(a)) {

        switch (a) {
            case 0:
                return b;
            default:
                return `${a} + ${b}`;
        }

    } else if (isNumber(b)) {

        switch (b) {
            case 0:
                return a;
            default:
                return `${a} + ${b}`;
        }

    } else {
        return `${a} + ${b}`;
    }

}

