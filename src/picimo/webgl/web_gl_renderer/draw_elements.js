(function(){
    'use strict';

    module.exports = function drawElements ( re/*nderer*/, draw ) {

        try {

            var gl          = re.app.gl;
            var glx         = re.app.glx;
            var program     = re.program; // => WebGlProgram
            var forceUpdate = false;

            var len, i, name, uniform, attr, etype;

            //==================================================================
            //
            // program
            //
            //==================================================================

            if ( !re.currentProgram || re.currentProgram !== program ) {

                re.currentProgram = program;
                program.use( glx );
                forceUpdate = true;

            }

            //==================================================================
            //
            // uniforms
            //
            //==================================================================

            for ( i = 0, len = program.uniformNames.length; i < len; i++ ) {

                name = program.uniformNames[ i ];
                uniform = re.program.uniform[ name ];

                uniform.setValue( re.uniforms.get( name ) );
                if ( forceUpdate ) uniform.valueChanged = true;

                uniform.upload( gl );

                // TODO
                if (uniform.isTexture()) updateTexUnit(re, uniform);

            }

            //==================================================================
            //
            // attributes
            //
            //==================================================================

            for ( i = 0, len = program.attribNames.length; i < len; i++ ) {

                name = program.attribNames[ i ];
                attr = re.program.attrib[ name ];

                attr.setValue( re.attributes.get( name ) );
                if ( forceUpdate ) attr.valueChanged = true;

                // TODO
                attr.upload( gl );

            }

            //==================================================================
            //
            // draw elements
            //
            //==================================================================

            // TODO

            etype = draw.elementType || gl.TRIANGLES;
            draw.buffer.webGlBuffer.bindBuffer();
            draw.buffer.webGlBuffer.drawElements(etype, draw.count, draw.offset);

        } catch (err) {

            console.error('drawElements', err, err.stack);
            throw err;

        }
    };

    function updateTexUnit(re, uniform) {

        // TODO

        var texUnit    = uniform.texUnit;
        var curTexUnit = re.currentTexUnits[texUnit];
        var gl         = re.app.gl;

        var glTexUnit;

        if (curTexUnit === -1 || (curTexUnit !== uniform.value)) {
            re.currentTexUnits[texUnit] = uniform.value;
            glTexUnit = gl.TEXTURE0 + texUnit;

            if (!re.currentGlTexUnit || (re.currentGlTexUnit !== glTexUnit)) {
                re.currentGlTexUnit = glTexUnit;
                gl.activeTexture(glTexUnit);
            }

            uniform.value.bind();
        }
    }

})();
