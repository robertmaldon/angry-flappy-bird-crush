#!/bin/bash
# a script to combine all sounds effect from assets/sfx/*.wav into a
# single audio sprite wav and writes it to assets/sfxSprite.wav
*
* You must have the "ffmpeg" utility already installed.
#
# the logic for doing this is largely borrowed from
# https://github.com/tonistiigi/audiosprite/blob/master/audiosprite.js

cd "$(dirname "$0")"/..

SAMPLE_RATE=44100
NUM_CHANNELS=2
GAP_SECONDS=0.5

TMP_DIR=tmp
RAW_SPRITE=${TMP_DIR}/sfxSprite.raw
SPRITE=assets/sfxSprite.wav
SPRITE_DATA=${TMP_DIR}/sfxSprite.js
RAW_SILENCE=${TMP_DIR}/silence.raw

sfx_files=$(ls assets/sfx/*.wav | sort -t '-' -n -k 2 | tr '\n' ' ')

rm -rf ${TMP_DIR}
mkdir ${TMP_DIR}

# perform a (potentially floating point) calculation
function float_calc() {
    echo "$1" | bc -l;
}

# calculate the "ceiling" of a floating point number
function ceil () {
    echo "define ceil (x) {if (x<0) {return x/1} \
         else {if (scale(x)==0) {return x} \
         else {return x/1 + 1 }}} ; ceil($1)" | bc;
}

offset_cursor=0

# append silence to the raw sprite
function addSilence() {
    silence_size=$(float_calc "${SAMPLE_RATE} * 2 * ${NUM_CHANNELS} * ${1}")
    silence_size_int=$(printf "%0.0f" "${silence_size}")
	mkfile ${silence_size_int} ${RAW_SILENCE}
	cat ${RAW_SILENCE} >> ${RAW_SPRITE}

	offset_cursor=$(float_calc "${offset_cursor} + ${1}")	
}

echo "this.sfxSprite = this.game.add.audio('sfxSprite');" >> ${SPRITE_DATA}

# put a second of silence at the start of the sprite. this is because
# older devices can start playing at the start of the sprite before
# successfully seeking to the correct offset for a particular effect.
addSilence 1

for sfx in ${sfx_files}
do
	sfx_base=$(basename "${sfx}" | sed s/\.[^\.]*$//)
	sfx_raw=${TMP_DIR}/"${sfx_base}".raw

    # Nnormalise (same sample rate, same number of channels, etc) each wav
    # file to an intermediate "raw" file 
	ffmpeg -i $sfx -ar ${SAMPLE_RATE} -ac ${NUM_CHANNELS} -f s16le ${sfx_raw}

	raw_size=$(wc -c "$sfx_raw" | sed 's/^ *//' | cut -f 1 -d ' ')
	duration=$(float_calc "${raw_size} / ${SAMPLE_RATE} / ${NUM_CHANNELS} / 2")

	offset_cursor_rounded=$(printf "%0.3f" "${offset_cursor}")
	duration_rounded=$(printf "%0.3f" "${duration}")
	sfx_name=$(echo "${sfx_base:0:1}" | tr '[a-z]' '[A-Z]')$(echo "${sfx_base:1}")
	echo "this.sfxSprite.addMarker('sfx${sfx_name}', ${offset_cursor_rounded}, ${duration_rounded});" >> ${SPRITE_DATA}

	offset_cursor=$(float_calc "${offset_cursor} + ${duration}")

    # append each sound effect to the same raw file
	cat ${sfx_raw} >> ${RAW_SPRITE}

    # add some silence (padding) in between each effect. this includes starting
    # the next effect on the next full second boundary + adding an additiional
    # half second.
    duration_ceil=$(ceil "${duration}")
    silence_secs=$(float_calc "${duration_ceil} - ${duration} + ${GAP_SECONDS}")
    addSilence "${silence_secs}"
done

# finally, convert the raw sprite to a wav
ffmpeg -y -ar ${SAMPLE_RATE} -ac ${NUM_CHANNELS} -f s16le -i ${RAW_SPRITE} ${SPRITE}
