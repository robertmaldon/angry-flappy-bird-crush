'use strict';

define(function () {
    function Preload() {
        this.asset = null;
        this.ready = false;
    }

    Preload.prototype = {
        preload: function() {
            this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
            this.asset.anchor.setTo(0.5, 0.5);

            this.load.onLoadComplete.addOnce(this.onLoadComplete, this);

            this.load.setPreloadSprite(this.asset);
            
            // use the Font.js lib to preload web fonts
            var fontBananaSplit = new Font();
            fontBananaSplit.fontFamily = 'PTBananaSplit';
            fontBananaSplit.src = 'assets/fonts/bananasp.ttf';

            this.load.image('cloud', 'assets/images/cloud.png');
            this.load.image('ground', 'assets/images/ground.png');

            this.load.spritesheet('birdBlue', 'assets/images/birdBlue.png', 32, 32);
            this.load.spritesheet('birdFlappy', 'assets/images/birdFlappy.png', 34, 24);
            this.load.spritesheet('birdGreen', 'assets/images/birdGreen.png', 102, 66);
            this.load.spritesheet('birdLarge', 'assets/images/birdLarge.png', 100, 96);
            this.load.spritesheet('birdRed', 'assets/images/birdRed.png', 50, 45);
            this.load.spritesheet('birdYellow', 'assets/images/birdYellow.png', 60, 58);

            this.load.spritesheet('explosion', 'assets/images/explosion.png', 96, 96);
            this.load.spritesheet('pipe', 'assets/images/pipes.png', 54, 320, 2);
            this.load.image('startButton', 'assets/images/startButton.png');
          
            this.load.image('instructions', 'assets/images/instructions.png');
          
            this.load.image('scoreboard', 'assets/images/scoreboard.png');
            this.load.spritesheet('medals', 'assets/images/medals.png',44, 46, 2);
            this.load.image('particle', 'assets/images/particle.png');

            this.load.audio('sfxSprite', 'assets/sfxSprite.wav');

            if (this.game.device.webAudio) {
                this.load.audio('musicFlyingWithoutWings', 'assets/music/flyingWithoutWings.mp3');
                this.load.audio('musicGoodTime', 'assets/music/goodTime.mp3');
                this.load.audio('musicIntro', 'assets/music/intro.mp3');
                this.load.audio('musicKeepOnMoving', 'assets/music/keepOnMoving.mp3');
                this.load.audio('musicWalkingOnSunshine', 'assets/music/walkingOnSunshine.mp3');
                this.load.audio('musicWishICouldFly', 'assets/music/wishICouldFly.mp3');
            }
        },
        create: function() {
            this.asset.cropEnabled = false;
        },
        update: function() {
            if (!!this.ready) {
                if (this.game.device.webAudio) {
                    if (this.cache.isSoundDecoded('musicFlyingWithoutWings') &&
                        this.cache.isSoundDecoded('musicGoodTime') &&
                        this.cache.isSoundDecoded('musicIntro') &&
                        this.cache.isSoundDecoded('musicKeepOnMoving') &&
                        this.cache.isSoundDecoded('musicWalkingOnSunshine') &&
                        this.cache.isSoundDecoded('musicWishICouldFly')) {
                        this.game.state.start('menu');
                    }
                } else {
                    this.game.state.start('menu');
                }
            }
        },
        onLoadComplete: function() {
            this.ready = true;
        }
    };

    return Preload;
});