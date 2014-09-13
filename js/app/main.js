'use strict';

define(function (require) {
    var BootState = require('./states/boot');
    var MenuState = require('./states/menu');
    var PlayState = require('./states/play');
    var PreloadState = require('./states/preload');

    var game = new Phaser.Game(500, 505, Phaser.AUTO, 'game-container');

    // game states
    game.state.add('boot', BootState);
    game.state.add('menu', MenuState);
    game.state.add('play', PlayState);
    game.state.add('preload', PreloadState);

    game.state.start('boot');
});