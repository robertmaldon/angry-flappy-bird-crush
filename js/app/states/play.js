'use strict';

define(function (require) {
    var Bird = require('../prefabs/bird');
    var Ground = require('../prefabs/ground');
    var Pipe = require('../prefabs/pipe');
    var PipeGroup = require('../prefabs/pipeGroup');
    var Scoreboard = require('../prefabs/scoreboard');

    function Play() {
        this.backgroundMusicIndex = 0;
    }

    Play.prototype = {
        create: function() {
            // start the phaser arcade physics engine
            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            // give our world an initial gravity of 1200
            this.game.physics.arcade.gravity.y = 1200;

            this.game.stage.backgroundColor = '#d0f4f7';
            
            // add some moving clouds
            this.clouds = this.game.add.group();
            for (var i = 0; i < 3; i++) {
                var cloud = this.game.add.sprite(this.game.rnd.integerInRange(0, this.game.width), this.game.rnd.integerInRange(0, 50), 'cloud');
                cloud.anchor.setTo(0.5, 0);
                this.clouds.add(cloud);

                // kill clouds when they are out of bounds
                cloud.checkWorldBounds = true;
                cloud.outOfBoundsKill = true;

                // move clouds
                this.game.physics.arcade.enableBody(cloud);
                cloud.body.allowGravity = false;
                cloud.body.velocity.x = -this.game.rnd.integerInRange(15, 30);
            }

            this.sfxSprite = this.game.add.audio('sfxSprite');
            this.sfxSprite.addMarker('sfxDelicious', 1.000, 1.164);
            this.sfxSprite.addMarker('sfxDivine', 3.500, 1.292);
            this.sfxSprite.addMarker('sfxFailed', 6.000, 2.669);
            this.sfxSprite.addMarker('sfxFlap', 9.500, 0.320);
            this.sfxSprite.addMarker('sfxFrogtastic', 11.000, 1.409);
            this.sfxSprite.addMarker('sfxHit', 13.500, 0.936);
            this.sfxSprite.addMarker('sfxSugarCrush', 15.000, 1.385);
            this.sfxSprite.addMarker('sfxSweet', 17.500, 0.995);
            this.sfxSprite.addMarker('sfxTasty', 19.000, 0.911);

            // create and add a group to hold our pipeGroup prefabs
            this.pipes = this.game.add.group();

            // create and add a new Bird object
            this.bird = new Bird(this.game, 100, this.game.height/2, this.sfxSprite);
            this.game.add.existing(this.bird);

            // create and add a new Ground object
            //this.ground = new Ground(this.game, 0, 400, this.game.width, 112);
            this.ground = new Ground(this.game, 0, 460, this.game.width, 50);
            this.game.add.existing(this.ground);
            
            // add keyboard controls
            this.flapKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.flapKey.onDown.addOnce(this.startGame, this);
            this.flapKey.onDown.add(this.bird.flap, this.bird);

            // add mouse/touch controls
            this.game.input.onDown.addOnce(this.startGame, this);
            this.game.input.onDown.add(this.bird.flap, this.bird); 

            // keep the spacebar from propogating up to the browser
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

            this.score = 0;
            //this.scoreText = this.game.add.bitmapText(this.game.width/2, 10, 'bananasp', this.score.toString(), 48);
            this.scoreText = this.game.add.text(this.game.world.centerX, 10, this.score.toString(), {font: '48px PTBananaSplit', fill: 'white', align: 'center' });
            this.scoreText.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);

            var getReadyText = this.game.add.text(this.game.world.centerX, 150, 'Get Ready!', {font: '90px PTBananaSplit', fill: '#00ff00', align: 'center' });
            getReadyText.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);

            this.instructionGroup = this.game.add.group();
            this.instructionGroup.add(getReadyText);
            this.instructionGroup.add(this.game.add.sprite(this.game.width/2, 325, 'instructions'));
            this.instructionGroup.setAll('anchor.x', 0.5);
            this.instructionGroup.setAll('anchor.y', 0.5);

            this.pipeGenerator = null;

            this.gameover = false;

            this.motivationalAssets = [
              {
                'text': 'Delicious!',
                'sound': 'sfxDelicious'
              },
              {
                'text': 'Divine!',
                'sound': 'sfxDivine'
              },
              {
                'text': 'Frogtastic!',
                'sound': 'sfxFrogtastic'
              },
              {
                'text': 'Sweet!',
                'sound': 'sfxSweet'
              },
              {
                'text': 'Sugar\nCrush!',
                'sound': 'sfxSugarCrush'
              },
              {
                'text': 'Tasty!',
                'sound': 'sfxTasty'
              },
            ];

            if (this.game.device.webAudio) {
                this.backgroundMusicAssets = [
                    this.game.add.audio('musicKeepOnMoving', 1, true),
                    this.game.add.audio('musicFlyingWithoutWings', 1, true),
                    this.game.add.audio('musicWalkingOnSunshine', 1, true),
                    this.game.add.audio('musicWishICouldFly', 1, true),
                    this.game.add.audio('musicGoodTime', 1, true),
                ];

                this.musicIntro = this.game.add.audio('musicIntro', 1, true);
                this.musicIntro.play();
            }
        },
        update: function() {
            // enable collisions between the bird and the ground
            this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);

            // revive dead clouds
            this.clouds.forEachDead(function(cloud){
                cloud.revive();
                cloud.x = this.game.width + cloud.width/2;
            }, this);

            if (!this.gameover) {    
                // enable collisions between the bird and each group in the pipes group
                this.pipes.forEach(function(pipeGroup) {
                    this.checkScore(pipeGroup);
                    this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
                }, this);
            }    
        },
        shutdown: function() {
            this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
            this.bird.destroy();
            this.pipes.destroy();
            this.scoreboard.destroy();
        },
        startGame: function() {
            this.sfxSprite.play('sfxFlap');

            if (!this.bird.alive && !this.gameover) {
                this.bird.body.allowGravity = true;
                this.bird.alive = true;
                // add a timer
                this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 2.25, this.generatePipes, this);
                this.pipeGenerator.timer.start();

                this.instructionGroup.destroy();

                if (this.game.device.webAudio) {
                    this.musicIntro.stop();

                    this.backgroundMusic = this.backgroundMusicAssets[this.backgroundMusicIndex];
                    this.backgroundMusic.play();
                    this.backgroundMusicIndex = this.backgroundMusicIndex + 1;
                    if (this.backgroundMusicIndex >= this.backgroundMusicAssets.length) {
                        this.backgroundMusicIndex = 0;
                    }
                }
            }
        },
        checkScore: function(pipeGroup) {
            if (pipeGroup.exists && !pipeGroup.hasScored && pipeGroup.topPipe.world.x <= this.bird.world.x) {
                pipeGroup.hasScored = true;
                this.score++;
                this.scoreText.setText(this.score.toString());

                var motivationAsset = this.motivationalAssets[this.game.rnd.integerInRange(0, this.motivationalAssets.length - 1)];
                this.sfxSprite.play(motivationAsset['sound']);

                var motivationText = this.game.add.text(this.game.world.centerX - 150, this.game.world.centerY, motivationAsset['text'], {font: '70px PTBananaSplit', fill: '#ffff00', align: 'center' });
                motivationText.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);

                this.game.add.tween(motivationText).to({y: -200}, 700, Phaser.Easing.Linear.NONE, true);;
            }
        },
        deathHandler: function(bird, enemy) {
            if (this.game.device.webAudio) {
                this.backgroundMusic.stop();
            }

            if (enemy instanceof Ground && !this.bird.onGround) {
                this.sfxSprite.play('sfxFailed');
                this.scoreboard = new Scoreboard(this.game);
                this.game.add.existing(this.scoreboard);
                this.scoreboard.show(this.score);
                this.bird.onGround = true;

                var explosion = this.game.add.sprite(this.bird.x - 50, this.bird.y - 60, 'explosion');
                explosion.animations.add('boom');
                explosion.animations.play('boom', 15);
            } else if (enemy instanceof Pipe) {
                this.sfxSprite.play('sfxHit');
            }

            if (!this.gameover) {
                this.gameover = true;
                this.bird.kill();
                this.pipes.callAll('stop');
                this.pipeGenerator.timer.stop();
                this.ground.stopScroll();
            }
        },
        generatePipes: function() {
            // gap between the pipes should vary depending on the height of the bird
            var gap = this.bird.texture.frame.height;

            var pipeY = this.game.rnd.integerInRange(-100, 100);
            var pipeGroup = this.pipes.getFirstExists(false);
            if (!pipeGroup) {
                pipeGroup = new PipeGroup(this.game, this.pipes);  
            }
            pipeGroup.reset(this.game.width, pipeY, gap);
        }
    };

    return Play;
});
