(function(){
    "use strict";

    var utils = require( '../utils' );


    function Uniform ( program, info ) {
        
        utils.object.definePropertiesPublicRO( this, {
        
            program  : program,
            info     : info,
            location : program.glx.gl.getUniformLocation( program.glProgram, info.name )
        
        });

        //Object.seal( this );

    }


    module.exports = Uniform;

})();
