(function(){
    "use strict";

    /**
     * @class Picimo.core.Viewport
     * @param {number} x - x
     * @param {number} y - y
     * @param {number} width - width
     * @param {number} height - height
     */

    function Viewport ( x, y, width, height ) {

        this.x = parseInt( x, 10 );
        this.y = parseInt( y, 10 );
        this.width = parseInt( width, 10 );
        this.height = parseInt( height, 10 );

    }


    module.exports = Viewport;

})();
