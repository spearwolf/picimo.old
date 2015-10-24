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

app.shader.loadVertexShader('complex-sprite', '/assets/shaders/complex-sprite/complex-sprite.vert');
app.shader.loadFragmentShader('complex-sprite', '/assets/shaders/complex-sprite/complex-sprite.frag');
app.shader.addProgram('picture', 'complex-sprite', 'complex-sprite');

var spwMiniLogo = app.scene.appendPicture('/assets/images/spw-mini-logo.png', {}, {

    init (picture) {

        picture.sprite.setSize(1000, 125);
        picture.sprite.setPos(0, 250);

    }

});

var skullBlue = app.scene.appendPicture('/assets/images/kastani/skull-blue-2000px.png', {}, {

    init (picture) {

        picture.sprite.setSize(4000, 1000);
        picture.sprite.setPos(0, -550);

    }

});

