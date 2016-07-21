/* global Picimo */
/* global setTimeout */

var app = window.app = new Picimo.App({
    alpha   : false,
    bgColor : '#a0c0e0'
});

// Set pixel resolution
app.scene.setSize( 640, 480, 'contain' );

app.scene.appendCanvas(256).on('init', function () {

    window.canvas = this;

    var cx = this.canvas.width / 2;
    var cy = this.canvas.height / 2;
    var r = Math.round(0.8 * (cx < cy ? cx : cy));
    var ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#f0f0f0';
    ctx.lineWidth = 2.0;
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.fill();

});

