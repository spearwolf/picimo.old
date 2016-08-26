'use strict';

const Picimo = require('../build/picimo');

describe("Picimo", function () {

    it("should contain Picimo.App constructor", function () {

        expect(typeof Picimo.App).toEqual('function');

    });

});

