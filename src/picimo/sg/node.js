(function(){
    "use strict";

    function Node () {

    }

    require( '../../utils/custom_event' ).eventize( Node.prototype );

    module.exports = Node;

})();
