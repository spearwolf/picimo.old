/* global Picimo */
'use strict';

// =========================== //
//  S E T U P
// =========================== //

var app = new Picimo.App({ alpha: true, canvas: document.getElementById('picimo') });
app.scene.setSize( 1000, 750, 'contain' );

app.shader.loadVertexShader('complex-sprite', '/assets/shaders/complex-sprite/complex-sprite.vert');
app.shader.loadFragmentShader('complex-sprite', '/assets/shaders/complex-sprite/complex-sprite.frag');
app.shader.addProgram('picture', 'complex-sprite', 'complex-sprite');

window.spearwolf = app.scene.appendPicture('/assets/images/spw-mini-logo.png', {

    displaySize: 'contain',

}, {

    init (picture) {

        picture.setZoom(0.75);

    },

    renderFrame (picture) {

        this.rotateBase = this.rotateBase === undefined ? 0.0 : this.rotateBase + picture.app.frameTime * -20.0;

        var scrollTop = Math.abs(document.body.getBoundingClientRect().top);  // document.body.scrollTop;

        picture.rotateDegree = this.rotateBase + (scrollTop * 0.25);

    }

});

