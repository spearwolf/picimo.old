'use strict';

import { definePropertyPublicRO } from './object_utils';
//import { publicRO } from './object_decorator';

/**
 * A fast and simple queue.
 *
 * @class Picimo.utils.Queue
 * @classdesc
 * As long as the queue is stable, meaning values are added and removed at roughtly the same pace,
 * the backing store will not create new objects.
 *
 */

export default class Queue {

    constructor () {
        definePropertyPublicRO(this, 'entries', []);
    }

    /**
     * @member {Array} Picimo.utils.Queue#entries
     * @readonly
     */
    //@publicRO
    //entries = [];

    /**
     * @member {number} Picimo.utils.Queue#length
     */
    length  = 0;

    /**
     * Push value at the end of the queue.
     * @method Picimo.utils.Queue#push
     * @param value
     */
    push (value) {

        let item;

        if (this.length < this.entries.length) {

            this.entries[this.length].value = value;

        } else {

            item = Object.create(null);
            item.value = value;

            this.entries.push(item);
        }

        ++this.length;

    }

    /**
     * Returns the last added value from the end of the queue.
     * @method Picimo.utils.Queue#pop
     * @return value or undefined
     */
    pop () {

        let item;
        let value;

        if (this.length > 0) {

            --this.length;

            item = this.entries[this.length];
            value = item.value;
            item.value = null;

            return value;

        }

    }

    /**
     * Clears the queue.
     * @method Picimo.utils.Queue#pop
     * @param {boolean} hard - By default the backing store will not destroy its internal objects. If you want do that set this param to true.
     */
    clear (hard) {

        let i = this.length;

        for (; i--;) {
            this.entries[i].value = null;
        }

        this.length = 0;

        if (hard) this.entries.length = 0;

    }

    /**
     * Iterate over all items and execute the callback function for each item.
     * @method Picimo.utils.Queue#forEach
     * @param {function} callback
     * @param {object} [ctx] Define an explicit context for the callback function.
     */
    forEach (callback, ctx) {

        let len = this.length;
        let item;
        let i;

        for (i = 0; i < len; i++) {
            item = this.entries[i].value;
            if (item) callback.call(ctx || item, item);
        }

    }

}  // => end of class

