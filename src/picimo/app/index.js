(function(){
    "use strict";

    var utils = require( '../utils' );

    /**
     * @class Picimo.App
     */

    function App () {

    }

    utils.custom_event.eventize( App.prototype );

    module.exports = App;

})();
