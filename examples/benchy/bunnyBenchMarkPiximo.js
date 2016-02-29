/* global Piximo */
(function(){
    "use strict";

    console.log('welcome to %c bunny benchmark v3 %c -> %c picimo version ', 'background-color:yellow', 'background-color:transparent', 'background-color:red;color:#fff');

    var app = window.app = new Piximo.App({ bgColor: '#9ab', stats: true });

    app.loadTextureAtlas('nobinger.json').then(function(atlas){

        window.bunnys = atlas;

        var scene = app.scene.createScene('bunnysPlayground', { width: 800, height: 600 });
        var layer = scene.createSpritesLayer(atlas, { name: 'bunnysLayer', spriteCapacity: 16000 });


        layer.createBunnys = function(bunnyCount, frameName) {

            var i, bunny;

            for (i = 0; i < bunnyCount; i++) {

                bunny = this.createSprite(frameName ? frameName : sample(atlas.frameNames))
                            .setTranslate(
                                Math.random() * (scene.width  / 2),
                                Math.random() * (scene.height / 2) );
                                //Math.random() * scene.width  - ( scene.width  / 2 ),
                                //Math.random() * scene.height - ( scene.height / 2 ) );

                bunny.speedX = Math.random() * 8;
                bunny.speedY = ( Math.random() * 8 ) - 4;

                bunny.rotateDegree = (Math.random() * 90) - 45;
                bunny.speedRotate = Math.random() * 4;

                this.allBunnys.push( bunny );
            }
        };


        layer.on('init', function(){

            this.allBunnys = [];

            this.createBunnys( 20 );

        });

        layer.on('frame', function(){

            if (app.mouseController.isBtnLeftDown) {

                if (this.spritePool.usedSpritesCount < this.spriteCapacity - 10) {
                    this.createBunnys( 5, sample(atlas.frameNames) );
                }
            }

            var gravity     = -0.5;
            var half_width  = this.scene.width / 2;
            var half_height = this.scene.height / 2;

            var i, bunny, len = this.allBunnys.length;

            for (i = 0; i < len; i++) {

                bunny = this.allBunnys[i];

                bunny.rotateDegree += bunny.speedRotate;

                bunny.tx += bunny.speedX;
                bunny.ty += bunny.speedY;
                bunny.speedY += gravity;

                if (bunny.tx > half_width) {
                    bunny.speedX = -Math.abs(bunny.speedX);
                    bunny.tx = half_width;
                } else if (bunny.tx < -half_width) {
                    bunny.speedX = Math.abs(bunny.speedX);
                    bunny.tx = -half_width;
                }

                if (bunny.ty > half_height) {
                    bunny.speedY = -0.85;
                    bunny.ty = half_height;
                    if (Math.random() > 0.5) {
                        bunny.speedY -= Math.random() * 6;
                    }
                } else if (bunny.ty < -half_height) {
                    bunny.speedY = Math.random() * 25;
                    bunny.ty = -half_height;
                }

            }

        });

    });


    app.mouseController.onMouseDragLeft = function(event) {
        var scene = app.scene.find('bunnysPlayground');
        var dpr = scene.devicePixelRatio;
        scene.projection.translate(event.translateX / dpr, event.translateY / dpr);
    };


    function sample(arr) {
        return arr[(Math.random() * arr.length)|0];
    }

})();
