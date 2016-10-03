'use strict';

const Picimo = require('../build/picimo');

const DEFAULT_CANVAS_WIDTH  = 400;
const DEFAULT_CANVAS_HEIGHT = 300;

function createHtmlContainer (width, height) {

    let el = document.createElement('div');
    document.body.appendChild(el);

    el.style.display = 'block';
    el.style.position = 'absolute';
    el.style.width = width + 'px';
    el.style.height = height + 'px';

    return el;

}

function createPicimoApp (options = {}) {
    return new Picimo.App(Object.assign({}, {
        appendTo: createHtmlContainer(DEFAULT_CANVAS_WIDTH, DEFAULT_CANVAS_HEIGHT)
    }, options));
}

function waitUntilFrame (app, frameNo, fn) {
    let listener = app.on('frameEnd', () => {
        if (app.frameNo === frameNo) {
            app.off(listener);
            fn();
        }
    });
}

function waitUntilNextFrame (app, fn) {
    const frameNo = app.frameNo + 1;
    let listener = app.on('frameEnd', () => {
        if (app.frameNo === frameNo) {
            app.off(listener);
            fn();
        }
    });
}

module.exports = {
    createHtmlContainer,
    createPicimoApp,
    waitUntilFrame,
    waitUntilNextFrame
};

