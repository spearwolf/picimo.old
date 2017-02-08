/* jshint esversion:6 */

/**
 * @private
 */
export default function addTexUnitProperties ( uniform ) {

    if ( uniform.info.type === uniform.program.glx.gl.SAMPLER_2D ) {

        uniform.isSampler2d = true;
        uniform._texUnit = -1;

        Object.defineProperties( uniform, {

            texUnit: {

                get: function () {

                    return this._texUnit;

                },

                set: function ( texUnit ) {

                    if ( this._texUnit !== texUnit ) {

                        this._texUnit = texUnit;
                        this.valueChanged = true;

                    }

                }

            },

        });

    } else {

        uniform.isSampler2d = false;

    }

}

