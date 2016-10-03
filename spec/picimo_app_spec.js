'use strict';

const Picimo = require('../build/picimo');
const utils = require('./utils');

const CANVAS_WIDTH  = 400;
const CANVAS_HEIGHT = 300;

describe("Picimo.App", () => {

    let app;
    let resizeBeforeReady = false;
    let resizeCallCount = 0;
    let resizeCallCountBeforeReady = 0;

    beforeAll((done) => {

        app = new Picimo.App({ appendTo: utils.createHtmlContainer(CANVAS_WIDTH, CANVAS_HEIGHT) })

        app.on('ready', () => {
            resizeCallCountBeforeReady = resizeCallCount;
            resizeCallCount = 0;
        });

        app.on('resize', () => {
            resizeCallCount++;
            if (!app.ready) resizeBeforeReady = true;
        });

        utils.waitUntilFrame(app, 30, done);

    });

    it("should never call resize before ready", () => {
        expect(resizeCallCountBeforeReady).toEqual(0);
    });

    it("should call resize at least once", () => {
        expect(resizeCallCount).toBeGreaterThan(0);
    });

    it("should be ready after init done", () => {
        expect(resizeBeforeReady).toBeFalsy();
        expect(app.ready).toBeTruthy();
    });

    it("should initialize a webgl context", () => {
        expect(app.gl).toBeTruthy();
    });

    it("should have a root scene", () => {
        expect(app.scene).toBeTruthy();
    });

    it("should have a size", () => {
        expect(Math.round(app.width / app.devicePixelRatio)).toEqual(CANVAS_WIDTH);
        expect(Math.round(app.height / app.devicePixelRatio)).toEqual(CANVAS_HEIGHT);
    });

});

