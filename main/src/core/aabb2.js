
/**
 * Represents a 2d axis aligned boundary box.
 * @class AABB2
 * @param {number} [x0=0] - x0
 * @param {number} [x1=0] - x1
 * @param {number} [y0=0] - y0
 * @param {number} [y1=0] - y1
 */

export default class AABB2 {

    constructor (x0 = 0, x1 = 0, y0 = 0, y1 = 0) {

        if (x0 < x1) {

            /**
             * @type {number}
             */
            this.min_x = x0;
            /**
             * @type {number}
             */
            this.max_x = x1;

        } else {

            /**
             * @type {number}
             */
            this.min_x = x1;
            /**
             * @type {number}
             */
            this.max_x = x0;

        }

        if (y0 < y1) {

            /**
             * @type {number}
             */
            this.min_y = y0;
            /**
             * @type {number}
             */
            this.max_y = y1;

        } else {

            /**
             * @type {number}
             */
            this.min_y = y1;
            /**
             * @type {number}
             */
            this.max_y = y0;

        }

        Object.seal(this);

    } // => constructor

    /**
     * @type {number}
     */
    get width () {
        return this.max_x - this.min_x + 1;
    }

    /**
     * @type {number}
     */
    get height () {
        return this.max_y - this.min_y + 1;
    }

    /**
     * @type {number}
     */
    get center_x () {
        return ( this.max_x - this.min_x ) / 2;
    }

    /**
     * @type {number}
     */
    get center_y () {
        return ( this.max_y - this.min_y ) / 2;
    }

    /**
     * Extend the boundary box.
     *
     * @param {number} x - x
     * @param {number} y - y
     */
    addPoint (x, y) {

        if (x < this.min_x) {

            this.min_x = x;

        } else if (x > this.max_x) {

            this.max_x = x;

        }

        if (y < this.min_y) {

            this.min_y = y;

        } else if (y > this.max_y) {

            this.max_y = y;

        }

    }

    /**
     * Determinates wether or the 2d point is inside this AABB.
     *
     * @param {number} x - x
     * @param {number} y - y
     * @return {boolean} return true when point is inside the aabb
     */
    isInside (x, y) {

        if (x >= this.min_x && x <= this.max_x &&
            y >= this.min_y && y <= this.max_y) {

            return true;

        }

        return false;

    }

    /**
     * Determinates wether or not this AABB intersects *aabb*.
     *
     * @param {AABB2} aabb - aabb
     * @return {boolean} return true when there is some intersection between both
     */
    isIntersection (aabb) {

        if (aabb.max_x < this.min_x || aabb.min_x > this.max_x ||
            aabb.max_y < this.min_y || aabb.min_y > this.max_y) {

            return false;

        }

        return true;

    }

} // => class AABB2

