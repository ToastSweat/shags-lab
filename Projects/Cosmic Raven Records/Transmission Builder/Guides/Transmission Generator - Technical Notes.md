# Transmission Generator - Technical Notes

This document is the quick technical reference for `make_transmission.v4.bat`.

## Inputs

```bat
make_transmission.v4.bat "audio" "transmission" "artist" "title"
```

Example:

```bat
make_transmission.v4.bat "Empty (Cover).wav" "001A" "Nekroxx" "Empty"
```

## Pipeline

1. Validate input audio and required assets.
2. Create a temporary 48 kHz / stereo PCM WAV containing five seconds of `intro.wav` followed by the source track.
3. Feed that combined WAV once as final audio and a second time into `showfreqs` for the visualizer.
4. Loop the static background and transparent overlay images for the duration of the audio.
5. Draw fixed HUD text plus temporary-file artist/title/transmission text.
6. Encode 1920x1080 H.264 video with AAC audio.
7. Create a separate 1280x720 thumbnail using the dedicated thumbnail overlay.
8. Delete scratch files.

## Known baseline values

```text
Intro: 5 seconds
Video: 1920x1080 @ 30 fps
Codec: libx264
CRF: 18
Preset: medium
Pixel format: yuv420p
Audio: AAC 320k
Visualizer: showfreqs 820x110
Visualizer color: 0x22D0E6
Visualizer position: 270:885
Font: Consolas
```

## Scratch files

The generator may temporarily create:

```text
.crr_transmission.txt
.crr_artist.txt
.crr_track.txt
.crr_credit.txt
.crr_ffmpeg_error.txt
.crr_audio_error.txt
.crr_combined_audio.wav
```

These should not survive a successful run.

## Important provenance note

The archived `make_transmission.v4.bat` was reconstructed from the last known working v3.9 clean-intro-audio BAT plus the dedicated `thumbnail_overlay.png` V4 change.

It should be compared with the actual production BAT before being declared the final canonical copy.
