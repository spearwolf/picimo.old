(function(){
    "use strict";

    var utils = require( '../utils' );
    var addShaderValue = require( './add_shader_value' );

    function Attrib ( program, info ) {
        
        utils.object.definePropertiesPublicRO( this, {
        
            program  : program,
            info     : info,
            location : program.glx.gl.getAttribLocation( program.glProgram, info.name )
        
        });

        addShaderValue( this );

        Object.seal( this );

    }

    Attrib.prototype.upload = function ( gl ) {

        if ( ! this.valueChanged ) return;

        // TODO
        //this.value.vertexAttribPointer( this.name, this.location );

        this.valueChanged = false;

    };

    module.exports = Attrib;

})();
