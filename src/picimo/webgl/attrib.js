(function(){
    "use strict";

    var utils = require( '../utils' );


    function Attrib ( program, info ) {
        
        utils.object.definePropertiesPublicRO( this, {
        
            program  : program,
            info     : info,
            location : program.glx.gl.getAttribLocation( program.glProgram, info.name )
        
        });

        //Object.seal( this );

    }


    module.exports = Attrib;

})();
