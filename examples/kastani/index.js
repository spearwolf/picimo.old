/* global Picimo */

// wtf? {{{
console.log( '%c%s%c\n\n Welcome to the %ckastani%c demo -- a %c picimo %c demo!\n%c%s\n\n',
    'display:block;border-bottom:3px solid #888888;color:transparent',
    '*************************************************',
    'color:#888888',
    'font-weight:bold;color:#888888',
    'font-weight:normal;color:#888888',
    'color:#fff;background:linear-gradient(to right, #246 0%, #f06 100%)',
    'color:#888888',
    'display:block;border-bottom:1px solid #888888;color:transparent',
    '*************************************************' );  // }}}

// =========================== //
//  S E T U P
// =========================== //

var app = new Picimo.App({ alpha: true });
app.scene.setSize( 1000, 750, 'contain' );

window.spearwolf = app.scene.appendPicture('/assets/images/spw-mini-logo.png', {

    sceneFit: 'contain',
    zoom: 0.5,
    opacity: 0.9,
    posX: -400,
    posY: 200

});

window.skull0 = app.scene.appendPicture('/assets/images/kastani/skull-blue-2000px.png', {

    renderPrio: 100,

    displayPosition: {
        width: 4000,
        height: 1000,
        top: 100,
        left: -1000,
    }

});

window.skull1 = app.scene.appendPicture('/assets/images/kastani/skull-big-turquoise-2000px.png', {

    renderPrio: 90,

    displayPosition: {
        width: 4000,
        height: 1000,
        top: 225,
        left: -500,
    }

});

window.skull2 = app.scene.appendPicture('/assets/images/kastani/seamless-small-blue-red-yellow-1000px.png', {

    renderPrio: 80,

    displayPosition: {
        width: 3000,
        height: 258*3,
        top: 475,
        left: 0,
    }

});

