/* jshint browser:true */
/* jshint jasmine:true */
/* global Picimo */

describe("Picimo", function () {

    it("should contain Picimo.App constructor", function () {

        expect(typeof Picimo.App).toEqual('function');

    });

    it('compare arrays', () => {

        expect([1,2,3]).toEqual([1,2,3]);
        expect([1,2,3]).not.toEqual([1,2,4]);

    });

});

