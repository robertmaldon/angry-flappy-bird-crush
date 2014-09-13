'use strict';

define(function () {
    function Menu() {
    }

    Menu.prototype = {
        preload: function() {
        },
        create: function() {
            this.game.stage.backgroundColor = '#d0f4f7';
                
            // add the ground sprite as a tile and start scrolling in
            // the negative x direction
            this.ground = this.game.add.tileSprite(0, 460, this.game.width, 50, 'ground');
            this.ground.autoScroll(-200, 0);

            // create a group to put the title assets in 
            // so they can be manipulated as a whole
            this.titleGroup = this.game.add.group()
                  
            // create the title sprite and add it to the group
            this.title = this.game.add.text(0, 0, 'Angry Flappy\nBird Crush', {font: '70px PTBananaSplit', fill: '#ff0000', align: 'center' });
            this.title.setShadow(2, 2, 'rgba(0, 0, 0, 0.5)', 0);
            this.titleGroup.add(this.title);
                
            // create the bird sprite  and add it to the title group
            this.bird = this.add.sprite(200, 60, 'birdRed');
            this.titleGroup.add(this.bird);

            // add an animation to the bird and begin the animation
            this.bird.animations.add('flap');
            this.bird.animations.play('flap', 6, true);
                
            // set the originating location of the group
            this.titleGroup.x = 20;
            this.titleGroup.y = 100;

            // create an oscillating animation tween for the group
            this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

            // add our start button with a callback
            this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);
            this.startButton.anchor.setTo(0.5,0.5);
        },
        startClick: function() {
            // start button click handler start the 'play' state
            this.game.state.start('play');
        }
    };

    return Menu;
});
