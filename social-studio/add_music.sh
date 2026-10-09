#!/bin/bash
# Usage: add_music.sh <video.mp4> <music.mp3> <out.mp4>
# Lays a song under a silent video with a short fade in and a 1.5s fade out.
v="$1"; m="$2"; o="$3"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$v")
fo=$(python3 -c "print(round($d-1.5,2))")
ffmpeg -v error -y -i "$v" -i "$m" -map 0:v -map 1:a -c:v copy \
  -af "afade=t=in:d=0.6,afade=t=out:st=$fo:d=1.5,volume=0.9" -c:a aac -b:a 160k -shortest "$o"
echo "$o $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$o")"
