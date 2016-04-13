/* global Picimo */
'use strict';

// =========================== //
//  S E T U P
// =========================== //

var app = new Picimo.App({ alpha: true, canvas: document.getElementById('picimo') });
app.scene.setSize( 1000, 750, 'contain' );

window.spearwolf = app.scene.appendPicture('/assets/images/spw-mini-logo.png', {

    sceneFit: 'contain',

}, {

    rotateBase: 0.0,

    init (ready, picture) {

        picture.setZoom(1.5);

    },

    renderFrame (picture) {

        this.rotateBase += picture.app.frameTime * -20.0;

        var scrollTop = Math.abs(document.body.getBoundingClientRect().top);  // document.body.scrollTop;

        picture.rotateDegree = this.rotateBase + (scrollTop * 0.25);
        picture.setZoom(1.5 + (Math.sin(picture.app.now * 1.5) * 0.5));

    }

});

