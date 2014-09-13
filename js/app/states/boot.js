'use strict';

define(function () {
    function Boot() {
    }

    Boot.prototype = {
        preload: function() {
            this.load.image('preloader', 'assets/images/preloader.gif');
        },
        create: function() {
            this.game.input.maxPointers = 1;

            console.log('viewport: width: ' + document.documentElement.clientWidth + ', height: ' + document.documentElement.clientHeight);

            // responsive settings 
            if (this.game.device.desktop) {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.minWidth = 480;
                this.game.scale.minHeight = 260;
                this.game.scale.maxWidth = 1024;
                this.game.scale.maxHeight = 768;
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
                this.game.scale.setScreenSize(true);
            } else {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.game.scale.minWidth = 260;
                this.game.scale.minHeight = 480;
                this.game.scale.maxWidth = 1024;
                this.game.scale.maxHeight = 768;
                this.game.scale.pageAlignHorizontally = true;
                this.game.scale.pageAlignVertically = true;
                this.game.scale.forceOrientation(false, true); // run in 'portrait' orientation
                this.game.scale.hasResized.add(this.gameResized, this);
                this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
                this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
                this.game.scale.setScreenSize(true);
            }

            this.game.state.start('preload');
        },
        gameResized: function (width, height) {
            // this could be handy if you need to do any extra processing
            // if the game resizes. a resize could happen if for example
            // swapping orientation on a device.
        },
        enterIncorrectOrientation: function () {
            document.getElementById('orientation').style.display = 'block';
        },
        leaveIncorrectOrientation: function () {
            document.getElementById('orientation').style.display = 'none';
        }
    };

    return Boot;
});