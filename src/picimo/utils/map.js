(function(){
    "use strict";

    module.exports = typeof Map === 'undefined' ? require( 'core-js/library' ).Map : Map;

})();
