'use strict';

import { definePropertyPublicRO } from './object_utils';

/**
 * @desc
 *   A fast and simple queue.
 *
 *   As long as the queue is stable, meaning values are added and removed at roughtly the same pace,
 *   the backing store will not create new objects.
 */
export default class Queue {

    length  = 0;

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
     * Append value to the end of the queue.
     *
     * @param {*} value
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
     * Return the last added value from the end of the queue.
     *
     * @return {*|undefined}
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
     *
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
     *
     * @param {function(item:*)} callback
     * @param {?object} ctx - Define an explicit context for the callback function.
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

