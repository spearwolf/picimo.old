(function(){
    "use strict";

    function App () {

    }

    require( '../../utils/custom_event' ).eventize( App.prototype );

    module.exports = App;

})();
