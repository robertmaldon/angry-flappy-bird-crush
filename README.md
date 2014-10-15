angry-flappy-bird-crush
=======================

A web-based tribute to some of the most popular mobile games from the recent past.

A mash up of Flappy Bird, Angry Birds and Candy Crush. If you like this mashup go and download [Angry Birds](https://www.angrybirds.com/) and [Candy Crush](http://www.candycrushsaga.com/) (you can't get Flappy Bird anymore!).

[Demo](https://robertmaldon.github.io/demo/angry-flappy-bird-crush/)

It is responsive and has been tested on Andriod 4.0 (latest Chrome), iOS 6 (iPhone and iPad) and desktop (latest Chrome and Firefox).

## Installation

This application is pure HTML/CSS/JavaScript so just copy the files from this repo as is and serve them from any HTTP server.

## Development

Because of browser security this application must be served up from an HTTP server rather than load from a file://... url.

If you want to develop this application further there are a couple of scripts in the "dev" directory that might help you:

* "audioSprite.sh" - combines all audio files in assets/sfx/*.wav into a single audio sprite as assets/sfxSprite.wav. Assumes you have the "ffmpeg" command line utility already installed.
* "server.sh" - starts a modified version of the python SimpleHTTPServer that disables browser caching. If you are running Mac OSX or Linux then you should have python already installed.

## crosswalk

The "native" way to run an HTML application on Android is to use a [WebView](http://developer.android.com/reference/android/webkit/WebView.html), which is basically a web rendering engine packaged as part of Android.

An interesting challenge is that WebView has different capabilities - and therefore different behaviour - depending on the version of Android. e.g. WebView in one version of Android may support the HTML4 LocalStorage API while WebView in a different version of Android may not support it.

One solution to this challenge is to use [crosswalk](https://crosswalk-project.org/), an embeddable web rendering engine based on Chromium. By embedding crosswalk into your Android application you will have consistent behaviour across most versions of Android (some APIs may not work due to hardware limitations), but at the cost of a much larger application size. e.g. Angry Flappy Bird Crush + crosswalk has a storage size of 70 MB versus Flappy Bird which has a 2.5 MB storage size.

If storage size is not a concern then read on.

To package Angry Flappy Bird Crush as an Android application using crosswalk do the following:

1. Install and configure python, java, ant, the android sdk and the crosswalk "Android (ARM + x86)" application template - [Linux/Mac setup](https://crosswalk-project.org/#documentation/getting_started/linux_host_setup) or [Windows setup](https://crosswalk-project.org/#documentation/getting_started/windows_host_setup)
2. Make sure you can [deploy to an Android device or emulator](https://crosswalk-project.org/#documentation/getting_started/android_target_setup)
3. [Build and run the application](https://crosswalk-project.org/#documentation/getting_started/run_on_android). i.e.

a. Go to the unpacked Crosswalk Android directory

    cd ~/tools/crosswalk-9.38.208.1

b. Package the application

    python make_apk.py --package org.angryflappybirdcrush --mainfest ~/projects/angry-flappy-bird-crush/manifest.json --verbose

c. Install the application on the target device:

    adb install -r Angryflappybirdcrush_1.0.0_arm.apk

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
