angry-flappy-bird-crush
=======================

A web-based tribute to some of the most popular mobile games from the recent past.

A mash up of Flappy Bird, Angry Birds and Candy Crush. If you like this mashup go and download [Angry Birds](https://www.angrybirds.com/) and [Candy Crush](http://www.candycrushsaga.com/) (you can't get Flappy Bird anymore!).

[Demo](http://htmlpreview.github.io/?https://github.com/robertmaldon/angry-flappy-bird-crush/blob/master/index.html)

It is responsive and has been tested on Andriod 4.0 (latest Chrome), iOS 6 (iPhone and iPad) and desktop (latest Chrome and Firefox).

## Installation

This application is pure HTML/CSS/JavaScript so just copy the files from this repo as is and serve them from any HTTP server.

## Development

Because of browser security this application must be served up from an HTTP server rather than load from a file://... url.

If you want to develop this application further there are a couple of scripts in the "dev" directory that might help you:

* "audioSprite.sh" - combines all audio files in assets/sfx/*.wav into a single audio sprite as assets/sfxSprite.wav. Assumes you have the "ffmpeg" command line utility already installed.
* "server.sh" - starts a modified version of the python SimpleHTTPServer that disables browser caching. If you are running Mac OSX or Linux then you should have python already installed.

## Credits

As usual I stand on the shoulders of giants. This game would not have been possible without:

* [codevinsky's Phaser 2.0 Flappy Bird Tutorial](http://www.codevinsky.com/phaser-2-0-tutorial-flappy-bird-part-1/) [source](https://github.com/codevinsky/flappy-bird-reborn) which provided much of the application structure and logic using...
* [Phaser](http://phaser.io/), the awesome HTML5 2D game framework
* [Don't Touch My Birdie](https://github.com/marksteve/dtmb)
* [Handle a pause screen with Phaser](http://www.loopeex.com/handle-a-pause-screen-with-phaser/)
* [PT Banana Split](http://www.fonts2u.com/pt-banana-split.font) is the freeware font used by Candy Crush
* [RequireJS](http://requirejs.org/) helps keep the application nice and modular
* [Font.js](https://github.com/Pomax/Font.js) enables preloading of web fonts

## A note on audio

Some mobile devices (seems to be most of the Android mobile devices) do not support the HTML5 WebAudio API, even if they are running the latest version of Chrome. There are a couple of consequences to this:

1. Multiple audio tracks cannot be played concurrently. e.g. background music + a sound effect
2. If you attempt to load and play multiple audio tracks - such as multiple sound effects - only the first audio track will successfully play.

So for devices that do not support the WebAudio API this game will:

1. Play only sounds effects (no background music!)
2. Uses an audio sprite to successfully play all of the sound effects. (To reduce complexity the audio sprite is used whether or not the WebAudio API is supported.)

A good summary of the state of WebAudio support on multiple devices can be found [here](http://pupunzi.open-lab.com/2013/03/13/making-html5-audio-actually-work-on-mobile/).

## Phaser resources

* [Phaser API doco](http://docs.phaser.io/)
* [Phaser examples](http://examples.phaser.io/index.html)
* [Phaser Full Screen Mobile Template](https://github.com/photonstorm/phaser/tree/master/resources/Project%20Templates/Full%20Screen%20Mobile)
