'use strict';

define(function () {
    var Bird = function(game, x, y, sfxSprite, frame) {
        var birds = ['birdBlue', 'birdFlappy', 'birdGreen', 'birdLarge', 'birdRed', 'birdYellow'];

        Phaser.Sprite.call(this, game, x, y, birds[game.rnd.integerInRange(0, birds.length - 1)], frame);
        this.anchor.setTo(0.5, 0.5);
        this.animations.add('flap');
        this.animations.play('flap', 6, true);

        this.sfxSprite = sfxSprite;

        this.name = 'bird';
        this.alive = false;
        this.onGround = false;

        // enable physics on the bird and disable gravity on the bird
        // until the game is started
        this.game.physics.arcade.enableBody(this);
        this.body.allowGravity = false;
        this.body.collideWorldBounds = true;

        this.events.onKilled.add(this.onKilled, this);
    };

    Bird.prototype = Object.create(Phaser.Sprite.prototype);
    Bird.prototype.constructor = Bird;

    Bird.prototype.update = function() {
        // check to see if our angle is less than 90
        // if it is rotate the bird towards the ground by 2.5 degrees
        if (this.angle < 90 && this.alive) {
            this.angle += 2.5;
        } 

        if (!this.alive) {
            this.body.velocity.x = 0;
        }
    };

    Bird.prototype.flap = function() {
        if (!!this.alive) {
            if (this.game.device.webAudio) {
                this.sfxSprite.play('sfxFlap');
            } else {
                this.sfxSprite.play('sfxFlap', 0, 1, false, false); // set 'forceRestart' to false so that on non-web audio devices other sound effects are not interrupted by a flap
            }

            // cause our bird to "jump" upward
            this.body.velocity.y = -400;
            
            // rotate the bird to -40 degrees
            this.game.add.tween(this).to({angle: -40}, 100).start();
        }
    };

    Bird.prototype.revived = function() {
    };

    Bird.prototype.onKilled = function() {
        this.exists = true;
        this.visible = true;
        this.animations.stop();
        var duration = 90 / this.y * 300;
        this.game.add.tween(this).to({angle: 90}, duration).start();
    };

    return Bird;
});
