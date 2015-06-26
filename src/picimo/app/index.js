(function(){
    "use strict";

    var utils = require( '../utils' );
    var sg    = require( '../sg' );

    /**
     * @class Picimo.App
     */

    function App () {

        utils.custom_event.eventize( this );

        var root = new sg.Node( this );
        utils.object.definePropertyPublicRO( this, 'root', root );

    }

    App.prototype.renderFrame = function () {

        if ( this.root ) {
        
            this.root.renderFrame();
        
        }

    };

    module.exports = App;

})();
