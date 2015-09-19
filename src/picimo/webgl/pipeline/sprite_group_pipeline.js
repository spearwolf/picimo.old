(function(){
    "use strict";

    var utils = require( '../../utils' );

    /**
     * @class Picimo.webgl.pipeline.SpriteGroupPipeline
     */

    function SpriteGroupPipeline ( app, program, voDescriptor, capacity ) {

        this.app          = app;
        this.program      = program;
        this.voDescriptor = voDescriptor;
        this.capacity     = capacity;

        // TODO
        // - create web gl vertex buffer from voDescriptor and capacity

        reset( this );

        this.renderCmdObj = null;

    }


    SpriteGroupPipeline.prototype.initGl = function () {

        var self = this;
    
        if ( ! this.renderCmdObj ) {

            this.renderCmdObj = new utils.ObjectPool( function () {

                var obj = {
                    program     : self.program,
                    uniforms    : null,
                    attributes  : null,
                    drawElements: null
                };

                // TODO
                //for attr in @program.attributeNames
                    //obj.attributes[attr] = @vertexBuffer

                // TODO
                //obj.drawElements.buffer      = @vertexIndexBuffer
                //obj.drawElements.elementType = gl.TRIANGLES

                Object.seal( obj );

                return obj;

            });

        }
    
    };


    function reset( pipeline ) {
    
        pipeline.currentSpriteCount  = 0;
        pipeline.currentSpriteOffset = 0;
        pipeline.totalSpritesCount   = 0;
        pipeline.texture             = null;
        pipeline.currentProgram      = null;

        if ( pipeline.renderCmdObj ) pipeline.renderCmdObj.releaseAll();
    
    }


    module.exports = SpriteGroupPipeline;

})();
