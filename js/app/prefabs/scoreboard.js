'use strict';

define(function () {
    var Scoreboard = function(game) {
        Phaser.Group.call(this, game);

        var gameoverText = this.game.add.text(0, 90, 'Game Over', {font: '90px PTBananaSplit', fill: '#ffa500', align: 'center' });
        gameoverText.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);
        this.add(gameoverText);

        this.scoreboard = this.create(this.game.width / 2, 235, 'scoreboard');
        this.scoreboard.anchor.setTo(0.5, 0.5);
        
        this.scoreText = this.game.add.text(this.scoreboard.width + 10, 185, '', {font: '36px PTBananaSplit', fill: 'white', align: 'center' });
        this.scoreText.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);
        this.add(this.scoreText);
        
        this.bestText = this.game.add.text(this.scoreboard.width + 10, 230, '', {font: '36px PTBananaSplit', fill: 'white', align: 'center' });
        this.bestText.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);
        this.add(this.bestText);

        // add our start button with a callback
        this.startButton = this.game.add.button(this.game.width/2, 330, 'startButton', this.startClick, this);
        this.startButton.anchor.setTo(0.5, 0.5);

        this.add(this.startButton);

        this.y = this.game.height;
        this.x = 0; 
    };

    Scoreboard.prototype = Object.create(Phaser.Group.prototype);
    Scoreboard.prototype.constructor = Scoreboard;

    Scoreboard.prototype.show = function(score) {
        var coin, bestScore;
        this.scoreText.setText(score.toString());
        if (!!localStorage) {
            bestScore = localStorage.getItem('bestScore');
            if (!bestScore || bestScore < score) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
            }
        } else {
            bestScore = 'N/A';
        }

        this.bestText.setText(bestScore.toString());

        if (score >= 10 && score < 20) {
            coin = this.game.add.sprite(-65 , 7, 'medals', 1);
        } else if (score >= 20) {
            coin = this.game.add.sprite(-65 , 7, 'medals', 0);
        }

        this.game.add.tween(this).to({y: 0}, 1000, Phaser.Easing.Bounce.Out, true);

        if (coin) {
            coin.anchor.setTo(0.5, 0.5);
            this.scoreboard.addChild(coin);
            
            // Emitters have a center point and a width/height, which
            // extends from their center point to the left/right and up/down
            var emitter = this.game.add.emitter(coin.x, coin.y, 400);
            this.scoreboard.addChild(emitter);
            emitter.width = coin.width;
            emitter.height = coin.height;
            emitter.makeParticles('particle');
            emitter.setRotation(-100, 100);
            emitter.setXSpeed(0,0);
            emitter.setYSpeed(0,0);
            emitter.minParticleScale = 0.25;
            emitter.maxParticleScale = 0.5;
            emitter.setAll('body.allowGravity', false);

            emitter.start(false, 1000, 1000);
        }
    };

    Scoreboard.prototype.startClick = function() {
        this.game.state.start('play');
    };

    Scoreboard.prototype.update = function() {
        // write your prefab's specific update code here
    };

    return Scoreboard;
});
