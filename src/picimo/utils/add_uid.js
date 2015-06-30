(function(){
    "use strict";

    var object_utils = require( './object_utils' );

    var UID = 0;

    module.exports = function addUid( obj ) {

        object_utils.definePropertyPublicRO( obj, 'uid', ( ++UID ) );

    };

})();
