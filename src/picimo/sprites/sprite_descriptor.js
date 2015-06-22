(function(){
    "use strict";

    var core = require( '../core' );

    module.exports = new core.VertexArrayDescriptor({

        vertexCount         : 4,
        vertexAttrCount     : 12,

        attrOffsetPosition  : 0,
        attrOffsetRotate    : 3,
        attrOffsetTexCoords : 4,
        attrOffsetTranslate : 6,
        attrOffsetScale     : 8,
        attrOffsetOpacity   : 9,

        vertexAttribPointer : {

            pos2d     : { type: 'V2v2v4v4'   },
            rotate    : { type: 'v2v1V1v4v4' },
            posZ      : { type: 'v2V1v1v4v4' },

            uv        : { type: 'v4V2v2v4'   },
            translate : { type: 'v4v2V2v4'   },
            scale     : { type: 'v4v4V1v1v2' },
            opacity   : { type: 'v4v4v1V1v2' }

        }

    });

})();
