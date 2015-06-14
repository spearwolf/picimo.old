(function(){
    "use strict";

    var Map = require( 'core-js/fn/map' );

    function WebGlContext ( gl ) {

        if ( ! gl ) throw new Error( 'WebGlContext: gl is undefined!' );

        Object.defineProperty( this, 'gl', { value: gl, enumerable: true } );

        this.clearCaches();

    }

    WebGlContext.prototype.clearCaches = function () {

        this._boundBuffers  = new Map();
        this._boundTextures = new Map();

    };

    module.exports = WebGlContext;

})();
