(function () {
    "use strict";

    function UniformValueStack () {

        this.value = null;
        this.commands = [];

    }


    UniformValueStack.prototype.exec = function ( cmd ) {

        var value;

        if ( cmd == null ) return;

        if ( cmd.isUniformValueCmd ) {

            value = cmd.getValue( this.value );

            if ( cmd.isRestorable ) {

                cmd.prevValue = this.value;
                this.commands.push( cmd );

            }
        
        } else if ( cmd.isUniformValueRestoreCmd ) {

            for ( var i = 0; i < this.commands.length; i++ ) {
            
                if ( this.commands[ i ].uid === cmd.uid ) {

                    value = this.commands[ i ].prevValue;
                    this.commands.splice( i, this.commands.length - i );
                    break;

                }
            
            }

            if ( value === undefined ) value = this.value;
        
        } else {

            value = cmd;
        
        }

        this.value = value;
    
    };


    module.exports = UniformValueStack;

})();
