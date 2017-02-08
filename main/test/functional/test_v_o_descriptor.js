/* global describe */
/* global it */
import assert from 'assert';
import { VODescriptor, VOArray } from '../src/core';
import { assertProperties, assertVOAttrDescriptor } from './utils';

describe('VODescriptor', () => {

    const descriptor = new VODescriptor({

        proto: {
            foo() {
                return this.voArray.float32Array[0];
            }
        },

        // vertex buffer layout
        // --------------------
        //
        // v0: (x0)(y0)(z0)(rotate](s0)(t0)(tx)(ty)(scale)(opacity)
        // v1: (x1)(y1)(z1)(rotate](s1)(t1)(tx)(ty)(scale)(opacity)
        // v2: (x2)(y2)(z2)(rotate](s2)(t2)(tx)(ty)(scale)(opacity)
        // v3: (x3)(y3)(z3)(rotate](s3)(t3)(tx)(ty)(scale)(opacity)
        //
        vertexCount: 4,

        attributes: [

            { name: 'position',  type: 'float32', size: 3, attrNames: [ 'x', 'y', 'z' ] },
            { name: 'rotate',    type: 'float32', size: 1, uniform: true },
            { name: 'texCoords', type: 'float32', size: 2, attrNames: [ 's', 't' ] },
            { name: 'translate', type: 'float32', size: 2, attrNames: [ 'tx', 'ty' ], uniform: true },
            { name: 'scale',     type: 'float32', size: 1, uniform: true },
            { name: 'opacity',   type: 'float32', size: 1, uniform: true }

        ],

        aliases: {

            pos2d: { size: 2, type: 'float32', offset: 0 },
            posZ:  { size: 1, type: 'float32', offset: 2, uniform: true },
            r:     { size: 1, type: 'float32', offset: 3 },
            uv:    'texCoords',

        }

    });

    it('new VODescriptor(...)', () => {
        assert(descriptor instanceof VODescriptor);
    });

    it('vertexCount', () => {
        assert.equal(descriptor.vertexCount, 4);
    });

    it('vertexAttrCount', () => {
        assert.equal(descriptor.vertexAttrCount, 10);
    });

    it('byte sizes', () => {
        assert.equal(descriptor.bytesPerVertex, 40);
        assert.equal(descriptor.rightPadBytesPerVertex, 0);
        assert.equal(descriptor.bytesPerVO, 160);
    });

    it('.typedArrays', () => {
        assert.equal(descriptor.typedArrays.uint8, false, 'typedArrays.uint8');
        assert.equal(descriptor.typedArrays.uint16, false, 'typedArrays.uint16');
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
        assert.equal(descriptor.attr.rotate.type, 'float32', 'rotate.type');
        assert.equal(descriptor.attr.rotate.byteOffset, 12, 'rotate.byteOffset');
    });

    it('attribute: position', () => {
        assertVOAttrDescriptor(descriptor, 'position', 3, 0, false, ['x', 'y', 'z']);
    });

    it('attribute: rotate', () => {
        assertVOAttrDescriptor(descriptor, 'rotate', 1, 3, true);
    });

    it('attribute: texCoords', () => {
        assertVOAttrDescriptor(descriptor, 'texCoords', 2, 4, false, ['s', 't']);
    });

    it('attribute: translate', () => {
        assertVOAttrDescriptor(descriptor, 'translate', 2, 6, true, ['tx', 'ty']);
    });

    it('attribute: scale', () => {
        assertVOAttrDescriptor(descriptor, 'scale', 1, 8, true);
    });

    it('attribute: opacity', () => {
        assertVOAttrDescriptor(descriptor, 'opacity', 1, 9, true);
    });

    it('attribute: pos2d', () => {
        assertVOAttrDescriptor(descriptor, 'pos2d', 2, 0, false);
    });

    it('attribute: posZ', () => {
        assertVOAttrDescriptor(descriptor, 'posZ', 1, 2, true);
    });

    it('attribute: uv', () => {
        assertVOAttrDescriptor(descriptor, ['uv', 'texCoords'], 2, 4, false, ['s', 't']);
    });

    describe('Vertex Object', () => {

        it('create single vertex object', () => {
            const vo = descriptor.createVO();
            assert(vo);
            assert(vo.descriptor instanceof VODescriptor, '.descriptor is missing');
            assert(vo.voArray instanceof VOArray, '.voArray is missing');
        });

        it('properties: position', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                function: ['setPosition'],
                number: ['x0', 'y0', 'z0',
                         'x1', 'y1', 'z1',
                         'x2', 'y2', 'z2',
                         'x3', 'y3', 'z3'],
                undefined: ['getPosition'],
            });
        });

        it('properties: rotate', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                number: ['rotate'],
                undefined: ['setRotate', 'getRotate', 'rotate0', 'rotate1', 'rotate2', 'rotate3']
            });
        });

        it('properties: texCoords', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                function: ['setTexCoords'],
                number: ['s0', 't0',
                         's1', 't1',
                         's2', 't2',
                         's3', 't3'],
                undefined: ['getTexCoords',
                            'texCoords_00', 'texCoords_10',
                            'texCoords_01', 'texCoords_11',
                            'texCoords_02', 'texCoords_12',
                            'texCoords_03', 'texCoords_13']
            });
        });

        it('properties: translate', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                function: ['setTranslate', 'getTranslate'],
                number: ['tx', 'ty']
            });
        });

        it('properties: scale', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                number: ['scale'],
                undefined: ['setScale', 'getScale']
            });
        });

        it('properties: opacity', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                number: ['opacity'],
                undefined: ['setOpacity', 'getOpacity']
            });
        });

        it('prototype: foo', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                function: ['foo'],
            });
        });

        it('prototype: pos2d', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                function: ['setPos2d'],
                undefined: ['getPos2d'],
                number: [
                    'pos2d_00', 'pos2d_10',
                    'pos2d_01', 'pos2d_11',
                    'pos2d_02', 'pos2d_12',
                    'pos2d_03', 'pos2d_13'],
            });
        });

        it('prototype: posZ', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                number: ['posZ'],
                undefined: ['setPosZ', 'getPosZ'],
            });
        });

        it('prototype: uv', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                undefined: ['setUv', 'getUv', 'uv', 'uv_00'],
            });
        });

        it('prototype: r', () => {
            const vo = descriptor.createVO();
            assertProperties(vo, {
                number: ['r0', 'r1', 'r2', 'r3'],
                function: ['setR'],
                undefined: ['getR']
            });
        });

        it('internal array buffer', () => {

            const attrList = ['position', 'r', 'texCoords', 'translate', 'scale', 'opacity'];
            const vo = descriptor.createVO();

            assert.deepEqual(vo.toArray(attrList), [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            ], `fresh & clean vertex array buffer`);

            vo.setPosition(1,2,3, 4,5,6, 7,8,9, 10,11,12);
            assert.deepEqual(vo.toArray(attrList), [
                 1,  2,  3,  0,  0,  0,  0,  0,  0,  0,
                 4,  5,  6,  0,  0,  0,  0,  0,  0,  0,
                 7,  8,  9,  0,  0,  0,  0,  0,  0,  0,
                10, 11, 12,  0,  0,  0,  0,  0,  0,  0,
            ], 'setPosition()');

            // x
            assert.equal(descriptor.attr.position.getValue(vo, 0, 0),  1, 'position.getValue(0, 0)');
            assert.equal(descriptor.attr.position.getValue(vo, 1, 0),  4, 'position.getValue(1, 0)');
            assert.equal(descriptor.attr.position.getValue(vo, 2, 0),  7, 'position.getValue(2, 0)');
            assert.equal(descriptor.attr.position.getValue(vo, 3, 0), 10, 'position.getValue(3, 0)');

            // y
            assert.equal(descriptor.attr.position.getValue(vo, 0, 1),  2, 'position.getValue(0, 1)');
            assert.equal(descriptor.attr.position.getValue(vo, 1, 1),  5, 'position.getValue(1, 1)');
            assert.equal(descriptor.attr.position.getValue(vo, 2, 1),  8, 'position.getValue(2, 1)');
            assert.equal(descriptor.attr.position.getValue(vo, 3, 1), 11, 'position.getValue(3, 1)');

            // z
            assert.equal(descriptor.attr.position.getValue(vo, 0, 2),  3, 'position.getValue(0, 2)');
            assert.equal(descriptor.attr.position.getValue(vo, 1, 2),  6, 'position.getValue(1, 2)');
            assert.equal(descriptor.attr.position.getValue(vo, 2, 2),  9, 'position.getValue(2, 2)');
            assert.equal(descriptor.attr.position.getValue(vo, 3, 2), 12, 'position.getValue(3, 2)');

            vo.rotate = 90;
            assert.deepEqual(vo.toArray(attrList), [
                 1,  2,  3, 90,  0,  0,  0,  0,  0,  0,
                 4,  5,  6, 90,  0,  0,  0,  0,  0,  0,
                 7,  8,  9, 90,  0,  0,  0,  0,  0,  0,
                10, 11, 12, 90,  0,  0,  0,  0,  0,  0,
            ], 'rotate=');

            assert.equal(descriptor.attr.rotate.getValue(vo), 90, 'rotate.getValue()');

            vo.opacity = 1.0;
            assert.deepEqual(vo.toArray(attrList), [
                 1,  2,  3, 90,  0,  0,  0,  0,  0, 1.0,
                 4,  5,  6, 90,  0,  0,  0,  0,  0, 1.0,
                 7,  8,  9, 90,  0,  0,  0,  0,  0, 1.0,
                10, 11, 12, 90,  0,  0,  0,  0,  0, 1.0,
            ], 'opacity=');

            vo.tx = 42;
            vo.ty = 43;
            assert.deepEqual(vo.toArray(attrList), [
                 1,  2,  3, 90,  0,  0, 42, 43,  0, 1.0,
                 4,  5,  6, 90,  0,  0, 42, 43,  0, 1.0,
                 7,  8,  9, 90,  0,  0, 42, 43,  0, 1.0,
                10, 11, 12, 90,  0,  0, 42, 43,  0, 1.0,
            ], 'tx=,ty=');

            assert.equal(vo.getTranslate(0), 42, 'getTranslate(0)');
            assert.equal(vo.getTranslate(1), 43, 'getTranslate(1)');

            assert.equal(descriptor.attr.translate.getValue(vo, 0, 0), 42, 'translate.getValue(0, 0)');
            assert.equal(descriptor.attr.translate.getValue(vo, 0, 1), 43, 'translate.getValue(0, 1)');

            vo.setPos2d(66,67, 68,69, 70,71, 72,73);
            assert.deepEqual(vo.toArray(attrList), [
                66, 67,  3, 90,  0,  0, 42, 43,  0, 1.0,
                68, 69,  6, 90,  0,  0, 42, 43,  0, 1.0,
                70, 71,  9, 90,  0,  0, 42, 43,  0, 1.0,
                72, 73, 12, 90,  0,  0, 42, 43,  0, 1.0,
            ], 'setPos2d()');

            vo.posZ = 66;
            assert.deepEqual(vo.toArray(attrList), [
                66, 67, 66, 90,  0,  0, 42, 43,  0, 1.0,
                68, 69, 66, 90,  0,  0, 42, 43,  0, 1.0,
                70, 71, 66, 90,  0,  0, 42, 43,  0, 1.0,
                72, 73, 66, 90,  0,  0, 42, 43,  0, 1.0,
            ], 'posZ=');

            vo.r0 = 45;
            vo.r1 = 47;
            vo.r2 = 49;
            vo.r3 = 51;
            assert.deepEqual(vo.toArray(attrList), [
                66, 67, 66, 45,  0,  0, 42, 43,  0, 1.0,
                68, 69, 66, 47,  0,  0, 42, 43,  0, 1.0,
                70, 71, 66, 49,  0,  0, 42, 43,  0, 1.0,
                72, 73, 66, 51,  0,  0, 42, 43,  0, 1.0,
            ], 'r0=,r1=,r2=,r3=');

            assert.equal(descriptor.attr.r.getValue(vo, 0), 45, 'r.getValue(0)');
            assert.equal(descriptor.attr.r.getValue(vo, 1), 47, 'r.getValue(1)');
            assert.equal(descriptor.attr.r.getValue(vo, 2), 49, 'r.getValue(2)');
            assert.equal(descriptor.attr.r.getValue(vo, 3), 51, 'r.getValue(3)');

            vo.pos2d_00 = 30;
            vo.pos2d_01 = 31;
            vo.pos2d_02 = 32;
            vo.pos2d_03 = 33;
            vo.pos2d_10 = 34;
            vo.pos2d_11 = 35;
            vo.pos2d_12 = 36;
            vo.pos2d_13 = 37;
            assert.deepEqual(vo.toArray(attrList), [
                30, 34, 66, 45,  0,  0, 42, 43,  0, 1.0,
                31, 35, 66, 47,  0,  0, 42, 43,  0, 1.0,
                32, 36, 66, 49,  0,  0, 42, 43,  0, 1.0,
                33, 37, 66, 51,  0,  0, 42, 43,  0, 1.0,
            ], 'pos2d_00=,pos2d_01=,...');

            assert.deepEqual(vo.toArray(), [
                30, 34, 66, 45,  0,  0, 42, 43,  0, 1.0,
                31, 35, 66, 45,  0,  0, 42, 43,  0, 1.0,
                32, 36, 66, 45,  0,  0, 42, 43,  0, 1.0,
                33, 37, 66, 45,  0,  0, 42, 43,  0, 1.0,
            ], '.toArray()');

        });

    });

});

