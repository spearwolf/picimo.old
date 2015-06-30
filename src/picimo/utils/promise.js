(function(){
    "use strict";

    module.exports = typeof Promise === 'undefined' ? require( 'core-js/library' ).Promise : Promise;

})();
