'use strict';

export default function drawElements ( re/*nderer*/, draw ) {

    var gl = re.app.gl;

    var program = re.program;   // = > WebGlProgram
    var programChanged = false;

    var attr;
    var elemType;
    var i;
    var len;
    var name;
    var uniform;

    //==================================================================
    //
    // program
    //
    //==================================================================

    if ( !re.currentProgram || re.currentProgram !== program ) {

        re.currentProgram = program;
        program.use();
        programChanged = true;

    }

    //==================================================================
    //
    // uniforms
    //
    //==================================================================

    var uniformValue;

    for ( i = 0, len = program.uniformNames.length; i < len; i++ ) {

        name         = program.uniformNames[ i ];
        uniform      = re.program.uniform[ name ];
        uniformValue = re.uniforms.get( name );

        if ( uniformValue != null ) uniformValue = uniformValue.value;

        if ( re.debugOutFrame ) {

            console.groupCollapsed('%cuniform', 'font-weight:bold;color:#26f', name);
            console.debug('value', uniformValue);
            console.debug('program->uniform', uniform);
            console.debug('renderer->uniformStack', re.uniforms.get(name));

        }

        uniform.setValue( uniformValue, re.debugOutFrame );

        if ( re.debugOutFrame ) {

            if ( programChanged ) console.log('programChanged', programChanged );
            console.groupEnd(name);

        }

        if ( programChanged ) uniform.valueChanged = true;

        try {

            uniform.upload( gl );

        } catch ( err ) {

            if ( re.debugOutFrame ) {
                console.error('[draw_elements] uniform upload panic:', name, uniform);
            }

        }

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
        if ( programChanged ) attr.valueChanged = true;

        attr.upload( gl );

    }

    //==================================================================
    //
    // draw elements
    //
    //==================================================================

    elemType = draw.elementType || gl.TRIANGLES;

    draw.buffer
        .bindBuffer()
        .drawElements( elemType, draw.count, draw.offset );

}

