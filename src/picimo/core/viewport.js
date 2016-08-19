'use strict';

import AABB2 from './aabb2';

export default class Viewport extends AABB2 {

    /**
     * @param {number} x - x
     * @param {number} y - y
     * @param {number} width - width
     * @param {number} height - height
     */
    constructor (x, y, width, height) {

        let min_x = parseInt(x, 10);
        let min_y = parseInt(y, 10);

        super(min_x, (min_x + parseInt(width,  10) - 1),
              min_y, (min_y + parseInt(height, 10) - 1));

    }

    /**
     * @type {number}
     */
    get x () {
        return this.min_x;
    }

    /**
     * @param {number} x
     * @type {number}
     */
    set x (x) {

        let w = this.width;

        /**
         * @type {number}
         */
        this.min_x = x;
        /**
         * @type {number}
         */
        this.max_x = x + w - 1;

    }

    /**
     * @type {number}
     */
    get y () {
        return this.min_y;
    }

    /**
     * @param {number} y
     * @type {number}
     */
    set y (y) {

        let h = this.height;

        /**
         * @type {number}
         */
        this.min_y = y;
        /**
         * @type {number}
         */
        this.max_y = y + h - 1;

    }

    /**
     * @type {number}
     */
    get width () {
        return this.max_x - this.min_x + 1;
    }

    /**
     * @param {number} y
     * @type {number}
     */
    set width (w) {
        /**
         * @type {number}
         */
        this.max_x = this.min_x + w - 1;
    }

    /**
     * @type {number}
     */
    get height () {
        return this.max_y - this.min_y + 1;
    }

    /**
     * @param {number} y
     * @type {number}
     */
    set height (h) {
        /**
         * @type {number}
         */
        this.max_y = this.min_y + h - 1;
    }

}

