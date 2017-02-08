/* global describe */
/* global it */
import assert from 'assert';
import VODescriptor from '../../src/core/v_o_descriptor';
//import { assertProperties, assertVOAttrDescriptor } from './utils';

describe('VODescriptor with mixed element types', () => {

    const descriptor = new VODescriptor({

        // vertex elements layout
        // ----------------------
        //
        // v0: (x0)(y0)(z0)(r0)(g0)(b0)(a)(tx)(ty)
        // v1: (x1)(y1)(z1)(r0)(g1)(b1)(a)(tx)(ty)
        // v2: (x2)(y2)(z2)(r0)(g2)(b2)(a)(tx)(ty)
        //
        vertexCount: 3,

        attributes: [

            { name: 'position',  type: 'float32', size: 3, attrNames: [ 'x', 'y', 'z' ] },
            { name: 'color',     type: 'uint8',   size: 4, attrNames: ['r', 'g', 'b', 'a'] },
            { name: 'translate', type: 'uint16',  size: 2, attrNames: [ 'tx', 'ty' ], uniform: true },
            { name: 'b',         type: 'uint8',   size: 1, uniform: true },

        ],

    });

    it('vertexCount', () => {
        assert.equal(descriptor.vertexCount, 3);
    });

    it('vertexAttrCount', () => {
        assert.equal(descriptor.vertexAttrCount, 10);
    });

    it('byte sizes', () => {
        assert.equal(descriptor.bytesPerVertex, 24);
        assert.equal(descriptor.rightPadBytesPerVertex, 3);
        assert.equal(descriptor.bytesPerVO, 72);
    });

    it('.typedArrays', () => {
        assert.equal(descriptor.typedArrays.uint8, true, 'typedArrays.uint8');
        assert.equal(descriptor.typedArrays.uint16, true, 'typedArrays.uint16');
        assert.equal(descriptor.typedArrays.float32, true, 'typedArrays.float32');
    });

    it('getAnyTypedArray()', () => {
        const vo = descriptor.createVO();
        const anyTypedArray = descriptor.getAnyTypedArray(vo.voArray);
        assert(anyTypedArray.buffer instanceof ArrayBuffer);
    });

    it('attr.type + byteOffset', () => {
        assert.equal(descriptor.attr.position.type, 'float32', 'position.type');
        assert.equal(descriptor.attr.position.byteOffset, 0, 'position.byteOffset');
        assert.equal(descriptor.attr.color.type, 'uint8', 'color.type');
        assert.equal(descriptor.attr.color.byteOffset, 12, 'color.byteOffset');
        assert.equal(descriptor.attr.translate.type, 'uint16', 'translate.type');
        assert.equal(descriptor.attr.translate.byteOffset, 16, 'translate.byteOffset');
    });

});

